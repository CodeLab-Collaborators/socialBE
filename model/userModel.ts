import { Request, Response, NextFunction } from "express";
import { iSocialUserData } from "../utils/interfaces/userInterface";
import mongoose from "mongoose";

interface iSocialUser extends iSocialUserData, mongoose.Document {}
