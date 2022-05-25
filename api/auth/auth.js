

app.get("/employeeList", (req, res) => {
    let employees = [];
  
    db.collection("employee")
      .find() // cursor toArray forEach
      .forEach((employee) => employees.push(employee))
      .then(() => {
        res.status(200).json(employees);
      })
      .catch(() => {
        res.status(500).json({ error: "Could not fatch the documents" });
      });
  });