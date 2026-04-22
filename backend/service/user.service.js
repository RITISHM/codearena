import User from "../models/users.js";
import Activity from "../models/activity.js";

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
    },
    { new: true, runValidators: true },
  );
  if (!user) throw new Error("unable to update");
  return user;
};

const deleteUser = async (Userid, password) => {
  if (!(await User.findById(userid).verifyPassword(password))) throw new error("invalidPassword");

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
export default { getUserById, updateUserById, deleteUser, getActivity };
