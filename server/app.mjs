import express from "express";
import connectionPool from "./db.mjs";

const app = express();
const port = 3123;



app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.get("/assignments", async (req, res) => {
  let assignments;
  try {
    const result =  await connectionPool.query("SELECT * FROM assignments");
    assignments = result.rows;
  } catch (e) {
    return res.status(500).json(
      { "message": "Server could not read assignment because database connection" });
  }
  return res.status(200).json({
  "data": [{ "assignment_data_1": {} }, { "assignment_data_2": {} }, { "assignment_data_3": {} }]
});
});

app.get("/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    let assignment;
      try {
        const result = await connectionPool.query(
         "SELECT * FROM assignments WHERE assignment_id = $1",
          [assignmentId]
        );
        assignment = result.rows[0];
      } catch (e) {
        return res.status(500).json(
          { "message": "Server could not read assignment because database connection" });
      }
      if (!assignment)
          return res.status(404).json(
          { "message": "Server could not find a requested assignment" });
        return res.status(200).json({
        "data": { "assignment_data_1": {} } 
});
}); 

app.put("/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } =  req.params;
    const updatedAssignment = {
        ...req.body,
        updated_at: new Date(),
        published_at: new Date()

    };
    try {
      const result = await connectionPool.query(
        `UPDATE assignments 
        SET title = $2, content = $3, categorylength = $4, updated_at = $5, published_at = $6, status = $7
        WHERE assignment_id = $1`,
        [
            assignmentId,
            updatedAssignment.title,
            updatedAssignment.content,
            updatedAssignment.categorylength,
            updatedAssignment.updated_at,
            updatedAssignment.published_at,
            updatedAssignment.status
        ]
      );
      if (result.rowCount === 0) {
          return res.status(404).json(
          { "message": "Server could not find a requested assignment to update" });
      }
  } catch (e) {
      return res.status(500).json(
      { "message": "Server could not update assignment because database connection" });
    }
    return res.status(200).json({ "message": "Updated assignment successfully" });
});
    
app.delete("/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    try {
      const result = await connectionPool.query(
        "DELETE FROM assignments WHERE assignment_id = $1",
        [assignmentId]
      );
      if (result.rowCount === 0) {
          return res.status(404).json(
          { "message": "Server could not find a requested assignment to delete" });
      }
  } catch (e) {
      return res.status(500).json(
      { "message": "Server could not delete assignment because database connection" });
    }
    return res.status(200).json({ "message": "Deleted assignment successfully" });
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
  } catch (e) {
      return res.status(500)
      .json({
      "message": "Server could not create assignment because database connection" });
    }
  

    return res.status(201).json({ "message": "Created assignment successfully" });
});



app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
