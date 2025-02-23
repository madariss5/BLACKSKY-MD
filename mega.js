const mega = require("megajs");

const auth = {
    email: process.env.MEGA_EMAIL,
    password: process.env.MEGA_PASSWORD,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
};

const upload = (data, name) => {
    return new Promise((resolve, reject) => {
        try {
            if (!auth.email || !auth.password || !auth.userAgent) {
                throw new Error("Missing required authentication fields");
            }

            const storage = new mega.Storage(auth, () => {
                data.pipe(storage.upload({ name: name, allowUploadBuffering: true }));
                storage.on("add", (file) => {
                    file.link((err, url) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        storage.close();
                        resolve(url);
                    });
                });
            });
        } catch (err) {
            console.error("Error in Mega upload:", err);
            reject(err);
        }
    });
};

module.exports = { upload };