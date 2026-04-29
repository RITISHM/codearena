import User from "../models/users.js";
import Activity from "../models/activity.js";
import Match from "../models/matches.js";
import Submission from "../models/submissions.js";

const getUserById = async (Userid) => {
  const user = await User.findOne({ _id: Userid });
  if (!user) throw new Error("user not found");
  return user;
};

const updateUserById = async (Userid, data) => {
  const user = await User.findOneAndUpdate(
    { _id: Userid },
    {
      username: data.username,
      firstName: data.firstname,
      lastName: data.lastname,
      dob: new Date(data.dob),
      region: data.region,
      github: data.github,
    },
    { returnDocument: "after", runValidators: true },
  );
  if (!user) throw new Error("unable to update");
  return user;
};

const deleteUser = async (Userid, password) => {
  if (!(await User.findById(Userid).then((user) => user.verifyPassword(password))))
    throw new Error("invalidPassword");

  const user = await User.findByIdAndDelete(Userid);
  return user;
};

const getActivity = async (userId, year) => {
  const activity = await Activity.find({
    userId: userId,
    date: {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    },
  });
  return activity;
};

const getRecentMatches = async (userId, limit = 10) => {
  const matches = await Match.find({
    $or: [{ "players.player1": userId }, { "players.player2": userId }],
    status: { $in: ["completed", "aborted"] },
  })
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate("players.player1", "username")
    .populate("players.player2", "username");

  return matches.map((m) => {
    const isPlayer1 = m.players.player1._id.toString() === userId.toString();
    const opponent = isPlayer1 ? m.players.player2 : m.players.player1;
    const myPoints = isPlayer1 ? m.points.player1 : m.points.player2;
    const isWinner = m.winner && m.winner.toString() === userId.toString();
    return {
      id: m._id,
      opponent: opponent?.username || "Unknown",
      outcome: m.status === "aborted" ? "Aborted" : isWinner ? "Win" : "Loss",
      score: myPoints,
      date: m.createdAt,
    };
  });
};

const getPaginatedMatches = async (userId, page = 1, limit = 10) => {
  const query = {
    $or: [{ "players.player1": userId }, { "players.player2": userId }],
  };
  const skip = (page - 1) * limit;
  const [matches, total] = await Promise.all([
    Match.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("players.player1", "username")
      .populate("players.player2", "username"),
    Match.countDocuments(query),
  ]);

  const formatted = matches.map((m) => {
    const isPlayer1 = m.players.player1._id.toString() === userId.toString();
    const opponent = isPlayer1 ? m.players.player2 : m.players.player1;
    const myPoints = isPlayer1 ? m.points.player1 : m.points.player2;
    const opponentPoints = isPlayer1 ? m.points.player2 : m.points.player1;
    const isWinner = m.winner && m.winner.toString() === userId.toString();
    return {
      id: m._id,
      opponent: opponent?.username || "Unknown",
      outcome: m.status === "aborted" ? "Aborted" : m.status === "ongoing" ? "Ongoing" : isWinner ? "Win" : "Loss",
      score: myPoints,
      opponentScore: opponentPoints,
      status: m.status,
      date: m.createdAt,
    };
  });

  return { matches: formatted, total, page: Number(page), totalPages: Math.ceil(total / limit) };
};

const getMatchDetail = async (matchId, userId) => {
  const match = await Match.findById(matchId)
    .populate("players.player1", "username firstName lastName")
    .populate("players.player2", "username firstName lastName")
    .populate("problemsId", "title problemId difficulty problemSlug")
    .populate("winner", "username");

  if (!match) throw new Error("Match not found");

  // Make sure the requesting user is a participant
  const isPlayer1 = match.players.player1._id.toString() === userId.toString();
  const isPlayer2 = match.players.player2._id.toString() === userId.toString();
  if (!isPlayer1 && !isPlayer2) throw new Error("Not authorized to view this match");

  // Get all submissions for this match
  const submissions = await Submission.find({ matchId })
    .populate("userId", "username")
    .populate("problemId", "title problemId difficulty")
    .sort({ createdAt: -1 });

  return {
    id: match._id,
    status: match.status,
    players: {
      player1: {
        ...match.players.player1.toObject(),
        points: match.points.player1,
        isYou: isPlayer1,
      },
      player2: {
        ...match.players.player2.toObject(),
        points: match.points.player2,
        isYou: isPlayer2,
      },
    },
    problems: match.problemsId,
    winner: match.winner,
    leftBy: match.left_by,
    startedAt: match.startedAt,
    createdAt: match.createdAt,
    submissions: submissions.map((s) => ({
      id: s._id,
      user: s.userId?.username || "Unknown",
      userId: s.userId?._id,
      problem: s.problemId?.title || "Unknown",
      problemId: s.problemId?.problemId,
      difficulty: s.problemId?.difficulty,
      language: s.language,
      status: s.status,
      executionTime: s.executionTime,
      memoryUsed: s.memoryUsed,
      testcase: s.testcase,
      code: s.code,
      createdAt: s.createdAt,
    })),
  };
};

export default { getUserById, updateUserById, deleteUser, getActivity, getRecentMatches, getPaginatedMatches, getMatchDetail };
