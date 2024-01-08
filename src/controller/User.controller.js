var bcrypt = require("bcryptjs");
const { scryptSync, randomBytes } = require("crypto");
const User = require('../models/User.model');

const { isEmpty } = require("../Utils/Sanitize.util");

exports.profile = (req, res, next) => {
    User.findById(req.userId, { password: 0 }, (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Server error." });
        }
        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }
        res.status(200).send(user);
    });
};

exports.stream = (req, res, next) => {
    User.findById(req.userId, { password: 0 }, (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Server error." });
        }
        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }
        res.status(200).send(user.streamData);
    });
};

exports.getColor = (req, res, next) => {
    let username = req.params.username;

    User.findOne({ userName: username }, function (err, user) {
        if (err) {
            return res.status(404).json({ message: "Server error." });
        }

        if (!user) {
            return res.status(404).send("User not found");
        }

        return res.status(200).send(user.streamData.color);
    });
}

exports.updateProfile = (req, res, next) => {
    User.findById(req.userId, (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Server error." });
        }
        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }

        if (!isEmpty(req.body.name) && user.userName.toLowerCase() === req.body.name.toLowerCase()) {
            user.streamData.name = req.body.name;
        }
        user.about = req.body.about;
        user.updated_at = Date.now();

        user.save((err) => {
            if (err) {
                return res.status(500).json({ message: "Server error." });
            }
            res.status(200).json({ message: "User was updated successfully." });
        });
    });
}

exports.updateContact = (req, res, next) => {
    const password = req.body.password;
    const newPassword = req.body.newPassword;

    User.findById(req.userId, (err, user) => {

        if (err) {
            return res.status(500).json({ message: "Server error." });
        }
        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Server error on password." });
            }

            if (!result) {
                res.status(403).json({ message: "Invalid current password." });
            }

            user.password = bcrypt.hashSync(newPassword, 8);
            user.updated_at = Date.now();
            user.save((err) => {
                if (err) {
                    return res.status(500).json({ message: "Server error." });
                }
                return res.status(200).json({ message: "User was updated successfully." });
            });
        })
    });
}

exports.updateStream = (req, res, next) => {
    User.findById(req.userId, (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Server error." });
        }
        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }

        user.streamData.category = req.body.category;
        user.streamData.tags = req.body.tags;
        user.streamData.titulo = req.body.title;
        user.streamData.languages = req.body.language;

        user.save((err) => {
            if (err) {
                res.status(500).json({ message: "Server error." });
                return;
            }
            res.status(200).json({ message: "User stream was updated successfully." });
        });
    });
}

exports.updateStreamKey = (req, res, next) => {
    User.findById(req.userId, (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Server error." });
        }
        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }

        const randomKey = (length) => {
            const salt = randomBytes(64).toString("hex")
            const getHash = (password) => scryptSync(password, salt, length).toString("hex");

            return getHash(new Date().getTime().toString());
        }

        var key = randomKey(64)
        user.key = key;

        user.save((err) => {
            if (err) {
                return res.status(500).json({ message: "Server error." });
            }
            return res.status(200).json({ message: "User stream key was updated successfully.", key: key });
        });
    });
}

exports.updateColor = (req, res, next) => {
    User.findById(req.userId, (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Server error." });
        }
        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }

        user.streamData.color = req.body.color;

        user.save((err) => {
            if (err) {
                return res.status(500).json({ message: "Server error." });
            }


            return res.status(200).json({ message: "User color was updated successfully." });
        });
    });
}

exports.deleteAccount = (req, res, next) => {
    User.findByIdAndRemove(req.userId, (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Server error." });
        }
        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }
        res.status(200).json({ message: "User was deleted successfully!" });
    });
}