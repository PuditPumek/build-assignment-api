import express from "express";
import connectionPool from "./db.mjs";

const app = express();
const port = 5000;

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.post("/assignments", async (req, res) => {

    const newAssignment = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date(),
        published: new Date()
    };
    try {
      await connectionPool.query(
        `INSERT INTO assignments (assignment_id, title, content, categorylength, created_at, updated_at, published_at, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
            1,
            newAssignment.title,
            newAssignment.content,
            newAssignment.categorylength,
            newAssignment.created_at,
            newAssignment.updated_at,
            newAssignment.published_at,
            newAssignment.status
        ]
      );
    } catch {
      return
      res.status(500).json({ 
        "message": "Server could not create assignment because database connection" });
    }

    return res.status(201).json({ "message": "Created assignment successfully" });
});



app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
