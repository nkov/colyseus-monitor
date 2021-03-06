"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const UNAVAILABLE_ROOM_ERROR = "@colyseus/monitor: room $roomId is not available anymore.";
function getAPI(server) {
    const api = express.Router();
    const handlers = Object.keys(server.matchMaker.handlers);
    api.get("/", (req, res) => {
        const result = {};
        Promise.all(handlers.map((handler) => {
            return server.matchMaker.
                getAllRooms(handler, 'getRoomListData').
                then((rooms) => {
                result[handler] = rooms;
            }).
                catch((err) => console.error(err));
        })).then(() => res.json(result));
    });
    api.get("/room", (req, res) => {
        const roomId = req.query.roomId;
        server.matchMaker.
            remoteRoomCall(roomId, "getInspectData").
            then((data) => res.json(data)).
            catch((_) => {
            console.error(UNAVAILABLE_ROOM_ERROR.replace("$roomId", roomId));
        });
    });
    api.get("/room/call", (req, res) => {
        const roomId = req.query.roomId;
        const method = req.query.method;
        const args = JSON.parse(req.query.args);
        server.matchMaker.
            remoteRoomCall(roomId, method, args).
            then((data) => res.json(data)).
            catch((_) => {
            console.error(UNAVAILABLE_ROOM_ERROR.replace("$roomId", roomId));
        });
    });
    return api;
}
exports.getAPI = getAPI;
