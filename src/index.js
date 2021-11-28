const { server } = require("./server/simple-crud-api");

const httpServer = server();

httpServer.listen(process.env.PORT || 3000, (err) => {
    if (err) {
        process.stderr.write("Something went wrong", "utf8");

        process.exit(1);
    } else {
        console.log("running on port", process.env.PORT);
    }
});
