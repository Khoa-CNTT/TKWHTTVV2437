const User = require("./models/User");
exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const newUser = await User.create({ name, email, password, role });
  res.json({ message: "User created" });
};
exports.deleteUser = async (req, res) => {
  await User.destroy({ where: { id: req.params.id } });
  res.json({ message: "User deleted" });
};
exports.toggleUserStatus = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  user.isActive = !user.isActive;
  await user.save();
  res.json({ message: "User status updated" });
};
