const express = require("express");
const nunjunks = require("nunjucks");
const app = express();
const path = __dirname + "/board";

app.set("view engine", "html");

nunjunks.configure("board", {
    express: app,
});

app.use(express.urlencoded({extended: true}));

const boardList = [
    {
        id: 1,
        user_id: "wnqudgus5565",
        writer: "주병현",
        title: "241230 월별평가",
        content: "열심히 하시는 모습 보기 좋습니다.",
        hit: 0
    },
];

app.get("/list", (req, res) => {
    res.render("list.html", {
        boardList
    });
});

app.get("/write", (req, res) => {
    res.sendFile(path + "/write.html");
});

app.get("/view", (req, res) => {
    const {id} = req.query;
    const board = boardList.find((value) => value.id === parseInt(id));

    res.render("view.html" , {
        board
    });
});

app.post("/write", (req, res) => {
    const {writer, title, content} = req.body;
    boardList.push({
        id: boardList.length + 1,
        user_id: "wnqudgus5565",
        writer: writer,
        title: title,
        content: content,
        hit: 0,
    });
    res.redirect(`/view?id=${boardList.length}`);
});

app.post("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = boardList.findIndex((value) => value.id === id);
    if(index === -1) {
        res.status(404).send("게시글이 존재하지 않습니다.");
    }
    boardList.splice(index, 1);
    res.redirect("/view");
});

app.get("/modify/:id", (req, res) => {
    const {id} = req.params;
    const board = boardList.find((value) => value.id === parseInt(id));

    res.render("modify.html", {
        board
    });
});

app.post("/modify/:id", (req, res) => {
    const {id} = req.params;
    const {writer, title, content} = req.body;
    const index = boardList.findIndex((value) => value.id === parseInt(id));
    if(index === -1){
        res.status(404).send("해당 아이디가 존재하지 않습니다.");
    }
    boardList[index].writer = writer;
    boardList[index].title = title;
    boardList[index].content = content;
    res.redirect(`/view?id=${id}`);
});

app.listen(3000, () => {
    console.log("server start");
});