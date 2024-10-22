import { Request, Response } from "express";
import MapPoint from "../models/MapPoint";

export const getMapPoints = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const mapPoints = await MapPoint.find();
    return res.status(200).json(mapPoints);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const addMapPoint = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const mapPoint = new MapPoint(req.body);
    await mapPoint.save();
    return res.status(201).json(mapPoint);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateMapPoint = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const mapPoint = await MapPoint.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!mapPoint) {
      return res.status(404).json({ error: "Map point not found" });
    }
    return res.status(200).json(mapPoint);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteMapPoint = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const mapPoint = await MapPoint.findByIdAndDelete(id);
    if (!mapPoint) {
      return res.status(404).json({ error: "Map point not found" });
    }
    return res.status(200).json({ message: "Map point deleted" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
