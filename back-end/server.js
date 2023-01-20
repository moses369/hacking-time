import express from "express";
import cors from "cors";

const PORT = 3000 || process.env.PORT;
const app = express();
//Check for correct properties
const checkBody = (req, res, next) => {
  try {
    const c = req.body;
    if (
      c.site === undefined ||
      c.name === undefined ||
      c.start_time === undefined ||
      c.end_time === undefined ||
      c.duration === undefined ||
      c.url === undefined ||
      c.in_24_hours === undefined ||
      c.status === undefined
    ) {
      res.status(400).json({
        message: "Format should have the following interface",
        data: {
          site: "string",
          name: "string",
          start_time: "Date",
          end_time: "Date",
          duration: "string" | "number",
          url: "string",
          in_24_hours: "string",
          status: "string",
        },
      });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(`URL: ${req.url}, METHOD: ${req.method}`);
  console.log(contests, "\n");
  next();
});

app
  .route("/api/saved")

  .get((req, res) => {
    try {
      res.json(contests);
    } catch (error) {
      next(err);
    }
  })
  .post(checkBody, (req, res) => {
    try {
      const newContest = req.body;
      //If we found it dont update the array
      if(contests.find((c) => c.name === newContest.name)){
        res.status(200).json(newContest);
        return;
      }
      contests.push(newContest);
      if (contests.length !== 0) {
        contests.sort((a, b) => a.start_time - b.start_time);
      }
      res.status(201).json(newContest);
    } catch (error) {
      next(err);
    }
  });

app
  .route("/api/saved/:name")

  .put(checkBody, (req, res) => {
    try {
      console.log("PARAMS:", req.params);
      const newContest = req.body;
      //Was found
      for (let contest of contests) {
        if (contest.name === req.params.name) {
          contest = newContest;
          res.status(200).json(contest);
          return;
        }
      }
      //Was not found
      contests.push(newContest);
      if (contests.length !== 0) {
        contests.sort((a, b) => a.start_time - b.start_time);
      }
      res.status(201).json(newContest);
    } catch (error) {
      next(err);
    }
  })
  .delete((req, res, next) => {
    try {
      console.log("PARAMS:", req.params);
      const indexOfRemoval = contests.findIndex(
        (contest) => contest.name === req.params.name
      );

      if (indexOfRemoval === -1) {
        next();
        return;
      }
      contests.splice(indexOfRemoval, 1);
      res.status(200).json('Deleted');
    } catch (error) {
      next(err);
    }
  });

app.use((req, res) => {
  res.status(404).json("Page Not Found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json("Internal Server Error");
});

app.listen(PORT, () => {
  console.log("Server listening on http//localhost:" + PORT);
});

//Our saved storage
const contests = [];
