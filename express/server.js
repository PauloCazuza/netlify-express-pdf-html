"use strict";
const express = require("express");
const path = require("path");
const fs = require("fs");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const pdf = require("html-pdf");

const router = express.Router();

const options = {
  format: "A4",
  border: {
    right: "8",
  },
};

router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.end();
});

router.get("/pdf", async function (req, res) {
  await setTimeout(
    () =>
      fs.readFile("./uploads/report.pdf", async function (err, data) {
        res.contentType("application/pdf");
        res.send(data);
      }),
    3000
  );
});

router.post("/", async function (req, res) {
  var { html } = req.body;
  html = Buffer.from(html, "base64").toString("ascii");
  // console.log(html);
  // console.log(html);

  await pdf.create(html, options).toFile("./uploads/report.pdf", () => {});

  await setTimeout(
    () =>
      fs.readFile("./uploads/report.pdf", async function (err, data) {
        res.contentType("application/pdf");
        res.send(data);
      }),
    3000
  );
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = app;
module.exports.handler = serverless(app);
