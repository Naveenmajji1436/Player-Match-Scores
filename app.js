const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketMatchDetails.db");
app = express();
app.use(express.json());
let db = null;

const serverInstall = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log(`Server Start...`);
    });
  } catch (e) {
    console.log(`DB ERROR : ${e.message}`);
    process.exit(1);
  }
};

serverInstall();

///GET 1
app.get("/players/", async (request, response) => {
  const sqlGet1Query = `
    SELECT player_id as playerId,player_name as playerName
    FROM player_details`;
  let Get1 = await db.all(sqlGet1Query);
  response.send(Get1);
});

///GET 2
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const sqlGet2Query = `
    SELECT player_id as playerId,player_name as playerName
    FROM player_details
    WHERE player_id = ${playerId}`;
  let Get2 = await db.get(sqlGet2Query);
  response.send(Get2);
});

/// PUT 3
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName } = request.body;
  const sqlPut3Query = `
    UPDATE player_details
    SET player_name = "${playerName}"
    WHERE player_id = ${playerId};`;
  await db.run(sqlPut3Query);
  response.send("Player Details Updated");
});

///GET 4
app.get("/matches/:matchId/", async (request, response) => {
  const { matchId } = request.params;
  const sqlGet4Query = `
    SELECT match_id as matchId,match,year
    FROM match_details
    WHERE match_id = ${matchId}`;
  let Get4 = await db.get(sqlGet4Query);
  response.send(Get4);
});

///GET 5
app.get("/players/:playerId/matches", async (request, response) => {
  const { playerId } = request.params;
  const sqlGet5Query = `
    SELECT match_details.match_id as matchId,match,year
    FROM player_match_score INNER JOIN match_details
    ON player_match_score.match_id = match_details.match_id
    WHERE player_id = ${playerId}
  `;
  let Get5 = await db.all(sqlGet5Query);
  response.send(Get5);
});

///GET 6
app.get("/matches/:matchId/players", async (request, response) => {
  const { matchId } = request.params;
  const sqlGet6Query = `
    SELECT player_details.player_id as playerId,player_name as playerName
    FROM player_match_score INNER JOIN player_details
    ON player_match_score.player_id = player_details.player_id
    WHERE match_id = ${matchId}
  `;
  let Get6 = await db.all(sqlGet6Query);
  response.send(Get6);
});

///GET 7
app.get("/players/:playerId/playerScores", async (request, response) => {
  const { playerId } = request.params;
  const sqlGet7Query = `
    SELECT player_details.player_id as playerId,player_name as playerName,
    sum(score) as totalScore,sum(fours) as totalFours,sum(sixes) as totalSixes
    FROM player_match_score INNER JOIN player_details
    ON player_match_score.player_id = player_details.player_id
    WHERE player_details.player_id = ${playerId}
  `;
  let Get7 = await db.get(sqlGet7Query);
  response.send(Get7);
});

module.exports = app;
