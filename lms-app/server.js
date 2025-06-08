const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;


app.use(express.json());


app.get("/courses", (req, res) => {
  fs.readFile("db.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });

    const db = JSON.parse(data);
    res.status(200).json(db.courses);
  });
});


app.post("/courses", (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  fs.readFile("db.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });

    const db = JSON.parse(data);
    const newCourse = {
      id: Date.now().toString(),
      title,
      description,
    };

    db.courses.push(newCourse);

    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save course" });
      res.status(201).json({ message: "Course added", course: newCourse });
    });
  });
});


app.listen(PORT, () => {
  console.log(`📚 LMS server is running at http://localhost:${PORT}`);
});
