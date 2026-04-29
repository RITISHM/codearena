import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, ChevronLeft, ChevronRight, Edit3, Trash2, X,
    FileCode2, Hash, Layers, TestTube2, Save
} from 'lucide-react';

// ─── Difficulty Badge ────────────────────────────────────────────
function DiffBadge({ diff }) {
    const colors = {
        easy: 'bg-success/15 text-success',
        medium: 'bg-amber-500/15 text-amber-400',
        hard: 'bg-danger/15 text-danger',
    };
    return <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${colors[diff] || 'bg-gray-500/15 text-gray-400'}`}>{diff}</span>;
}

// ─── Confirm Modal ───────────────────────────────────────────────
function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-2xl p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-danger hover:bg-red-400 transition-colors">Delete</button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Problem Form Modal ──────────────────────────────────────────
function ProblemFormModal({ open, onClose, onSave, initial }) {
    const isEdit = !!initial;
    const [form, setForm] = useState({
        problemId: '', title: '', description: '', problemSlug: '',
        difficulty: 'easy', constraints: [''], hints: [''],
        examples: [{ exampleNum: 1, exampleText: '', images: [] }],
        totalTestCases: 1,
        testcases: [{ input: '', output: '' }],
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initial) {
            setForm({
                problemId: initial.problemId || '',
                title: initial.title || '',
                description: initial.description || '',
                problemSlug: initial.problemSlug || '',
                difficulty: initial.difficulty || 'easy',
                constraints: initial.constraints?.length ? initial.constraints : [''],
                hints: initial.hints?.length ? initial.hints : [''],
                examples: initial.examples?.length ? initial.examples : [{ exampleNum: 1, exampleText: '', images: [] }],
                totalTestCases: initial.totalTestCases || 1,
                testcases: initial.testcases?.length ? initial.testcases : [{ input: '', output: '' }],
            });
        } else {
            setForm({
                problemId: '', title: '', description: '', problemSlug: '',
                difficulty: 'easy', constraints: [''], hints: [''],
                examples: [{ exampleNum: 1, exampleText: '', images: [] }],
                totalTestCases: 1,
                testcases: [{ input: '', output: '' }],
            });
        }
    }, [initial, open]);

    const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

    const handleListChange = (field, idx, value) => {
        const list = [...form[field]];
        list[idx] = value;
        setForm(f => ({ ...f, [field]: list }));
    };
    const addListItem = (field, defaultVal) => setForm(f => ({ ...f, [field]: [...f[field], defaultVal] }));
    const removeListItem = (field, idx) => setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));

    const handleTestcaseChange = (idx, key, value) => {
        const tc = [...form.testcases];
        tc[idx] = { ...tc[idx], [key]: value };
        setForm(f => ({ ...f, testcases: tc, totalTestCases: tc.length }));
    };
    const addTestcase = () => setForm(f => ({ ...f, testcases: [...f.testcases, { input: '', output: '' }], totalTestCases: f.testcases.length + 1 }));
    const removeTestcase = (idx) => {
        const tc = form.testcases.filter((_, i) => i !== idx);
        setForm(f => ({ ...f, testcases: tc, totalTestCases: tc.length }));
    };

    const handleExampleChange = (idx, key, value) => {
        const ex = [...form.examples];
        ex[idx] = { ...ex[idx], [key]: value };
        setForm(f => ({ ...f, examples: ex }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        const cleaned = {
            ...form,
            constraints: form.constraints.filter(c => c.trim()),
            hints: form.hints.filter(h => h.trim()),
            examples: form.examples.filter(e => e.exampleText.trim()),
            testcases: form.testcases.filter(t => t.input.trim() || t.output.trim()),
        };
        cleaned.totalTestCases = cleaned.testcases.length;
        await onSave(cleaned);
        setSaving(false);
    };

    if (!open) return null;

    const inputCls = "w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors";
    const labelCls = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5";

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-2xl w-full max-w-2xl mx-4"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
                    <h3 className="text-lg font-semibold text-white">{isEdit ? 'Edit Problem' : 'Create Problem'}</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Problem ID</label>
                            <input className={inputCls} placeholder="e.g. two-sum" value={form.problemId} onChange={e => handleChange('problemId', e.target.value)} disabled={isEdit} />
                        </div>
                        <div>
                            <label className={labelCls}>Slug</label>
                            <input className={inputCls} placeholder="e.g. two-sum" value={form.problemSlug} onChange={e => handleChange('problemSlug', e.target.value)} disabled={isEdit} />
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Title</label>
                        <input className={inputCls} placeholder="Problem title" value={form.title} onChange={e => handleChange('title', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Description</label>
                        <textarea className={`${inputCls} min-h-[100px] resize-y`} placeholder="Problem description..." value={form.description} onChange={e => handleChange('description', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Difficulty</label>
                        <select className={inputCls} value={form.difficulty} onChange={e => handleChange('difficulty', e.target.value)}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    {/* Constraints */}
                    <div>
                        <label className={labelCls}>Constraints</label>
                        {form.constraints.map((c, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input className={inputCls} value={c} onChange={e => handleListChange('constraints', i, e.target.value)} placeholder={`Constraint ${i + 1}`} />
                                {form.constraints.length > 1 && (
                                    <button onClick={() => removeListItem('constraints', i)} className="p-2 text-gray-500 hover:text-danger transition-colors"><X className="w-4 h-4" /></button>
                                )}
                            </div>
                        ))}
                        <button onClick={() => addListItem('constraints', '')} className="text-xs text-primary hover:text-blue-400 transition-colors">+ Add constraint</button>
                    </div>

                    {/* Hints */}
                    <div>
                        <label className={labelCls}>Hints</label>
                        {form.hints.map((h, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input className={inputCls} value={h} onChange={e => handleListChange('hints', i, e.target.value)} placeholder={`Hint ${i + 1}`} />
                                {form.hints.length > 1 && (
                                    <button onClick={() => removeListItem('hints', i)} className="p-2 text-gray-500 hover:text-danger transition-colors"><X className="w-4 h-4" /></button>
                                )}
                            </div>
                        ))}
                        <button onClick={() => addListItem('hints', '')} className="text-xs text-primary hover:text-blue-400 transition-colors">+ Add hint</button>
                    </div>

                    {/* Examples */}
                    <div>
                        <label className={labelCls}>Examples</label>
                        {form.examples.map((ex, i) => (
                            <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-dark-border/50 mb-2 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-medium">Example {i + 1}</span>
                                    {form.examples.length > 1 && (
                                        <button onClick={() => {
                                            const ex = form.examples.filter((_, j) => j !== i);
                                            setForm(f => ({ ...f, examples: ex }));
                                        }} className="text-gray-500 hover:text-danger transition-colors"><X className="w-3 h-3" /></button>
                                    )}
                                </div>
                                <textarea className={`${inputCls} min-h-[60px] resize-y`} value={ex.exampleText} onChange={e => handleExampleChange(i, 'exampleText', e.target.value)} placeholder="Example text..." />
                            </div>
                        ))}
                        <button onClick={() => setForm(f => ({ ...f, examples: [...f.examples, { exampleNum: f.examples.length + 1, exampleText: '', images: [] }] }))} className="text-xs text-primary hover:text-blue-400 transition-colors">+ Add example</button>
                    </div>

                    {/* Test Cases */}
                    <div>
                        <label className={labelCls}>Test Cases</label>
                        {form.testcases.map((tc, i) => (
                            <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-dark-border/50 mb-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500 font-medium">Test Case {i + 1}</span>
                                    {form.testcases.length > 1 && (
                                        <button onClick={() => removeTestcase(i)} className="text-gray-500 hover:text-danger transition-colors"><X className="w-3 h-3" /></button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] text-gray-600 uppercase">Input</label>
                                        <textarea className={`${inputCls} min-h-[50px] resize-y font-mono text-xs`} value={tc.input} onChange={e => handleTestcaseChange(i, 'input', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-600 uppercase">Output</label>
                                        <textarea className={`${inputCls} min-h-[50px] resize-y font-mono text-xs`} value={tc.output} onChange={e => handleTestcaseChange(i, 'output', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={addTestcase} className="text-xs text-primary hover:text-blue-400 transition-colors">+ Add test case</button>
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-dark-border">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                    <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-dark-bg bg-primary hover:bg-blue-400 disabled:opacity-50 transition-colors">
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Main Problems Page ──────────────────────────────────────────
export default function AdminProblems() {
    const [problems, setProblems] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [diffFilter, setDiffFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingProblem, setEditingProblem] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ open: false });
    const limit = 15;

    const fetchProblems = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit, search, difficulty: diffFilter });
            const res = await fetch(`/api/admin/problems?${params}`);
            if (res.ok) {
                const data = await res.json();
                setProblems(data.problems);
                setTotal(data.total);
                setTotalPages(data.totalPages);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [page, search, diffFilter]);

    useEffect(() => { fetchProblems(); }, [fetchProblems]);

    const [searchInput, setSearchInput] = useState('');
    useEffect(() => {
        const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
        return () => clearTimeout(t);
    }, [searchInput]);

    const handleSave = async (formData) => {
        const url = editingProblem ? `/api/admin/problems/${editingProblem._id}` : '/api/admin/problems';
        const method = editingProblem ? 'PUT' : 'POST';
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setFormOpen(false);
                setEditingProblem(null);
                fetchProblems();
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = (id, title) => {
        setConfirmModal({
            open: true,
            title: 'Delete Problem',
            message: `Are you sure you want to delete "${title}"? This cannot be undone.`,
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/admin/problems/${id}`, { method: 'DELETE' });
                    if (res.ok) fetchProblems();
                } catch (err) { console.error(err); }
                setConfirmModal({ open: false });
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Problem Management</h1>
                    <p className="text-sm text-gray-500 mt-1">{total} problems in database</p>
                </div>
                <button
                    onClick={() => { setEditingProblem(null); setFormOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-blue-400 text-dark-bg rounded-lg text-sm font-medium transition-colors hover:glow-primary"
                >
                    <Plus className="w-4 h-4" /> Add Problem
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text" placeholder="Search by title or ID..."
                        value={searchInput} onChange={e => setSearchInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-dark-panel border border-dark-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <select
                    value={diffFilter} onChange={e => { setDiffFilter(e.target.value); setPage(1); }}
                    className="px-4 py-2.5 bg-dark-panel border border-dark-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                    <option value="">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>

            {/* Table */}
            <div className="glass-panel rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-dark-border">
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Problem ID</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Difficulty</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Test Cases</th>
                                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-16">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                </td></tr>
                            ) : problems.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-16 text-gray-600">No problems found</td></tr>
                            ) : (
                                problems.map((p, i) => (
                                    <motion.tr
                                        key={p._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="border-b border-dark-border/50 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-3.5 h-3.5 text-gray-600" />
                                                <span className="text-gray-300 font-mono text-xs">{p.problemId}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-white font-medium">{p.title}</td>
                                        <td className="px-5 py-3.5"><DiffBadge diff={p.difficulty} /></td>
                                        <td className="px-5 py-3.5 hidden md:table-cell">
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <TestTube2 className="w-3.5 h-3.5" />
                                                <span className="text-sm">{p.totalTestCases}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => { setEditingProblem(p); setFormOpen(true); }}
                                                    className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p._id, p.title)}
                                                    className="p-1.5 rounded-lg text-gray-500 hover:text-danger hover:bg-danger/10 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3.5 border-t border-dark-border">
                        <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {formOpen && <ProblemFormModal open={formOpen} onClose={() => { setFormOpen(false); setEditingProblem(null); }} onSave={handleSave} initial={editingProblem} />}
            </AnimatePresence>
            <ConfirmModal {...confirmModal} onCancel={() => setConfirmModal({ open: false })} />
        </div>
    );
}
