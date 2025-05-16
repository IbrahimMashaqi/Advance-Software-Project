const {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../database_managment/users_DB");

async function getUsers(req, res) {
  try {
    if (req.user.role.toLowerCase() !== "admin") {
      res.status(403).json({ message: "Access denied", data: [] });
    }

    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}

async function getUserById(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const id = req.params.id;
    const result = await getUser(id, token);
    res.status(result.statusCode).json(result.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function upUser(req, res) {
  try {
    const { name, password, role } = req.body;
    if (
      req.user.role.toLowerCase() !== "admin" &&
      req.user.id !== req.params.id
    ) {
      return res.status(403).json({ message: "Access denied", data: [] });
    }
    const result = await updateUser(req.user.id, name, password, role);
    res.status(result.statusCode).send(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}

async function delUser(req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const result = await deleteUser(token, req.params.id);
    res.status(result.statusCode).send(result.message);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}

module.exports = { getUsers, getUserById, upUser, delUser };
