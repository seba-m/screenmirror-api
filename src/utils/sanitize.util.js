const sanitizeText = (string) => {
    return string.replace(/[^a-zA-Z0-9]/g, "");
};

const textRegex = (name) => {
    return new RegExp(`\\b\\w*${name}\\w*\\b`, "gi");
}

const isEmpty = (string) => {
    return string === null || string === undefined || string === "" || string.length === 0 || string.trim().length === 0;
}

exports.sanitizeText = sanitizeText;
exports.textRegex = textRegex;
exports.isEmpty = isEmpty;