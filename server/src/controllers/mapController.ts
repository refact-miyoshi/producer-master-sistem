import { Request, Response } from "express";
import MapPoint from "../models/MapPoint";

// すべての地図ポイントを取得する関数
export const getMapPoints = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // データベースからすべてのMapPointを取得する
    const mapPoints = await MapPoint.find();
    // ステータスコード200（成功）と共に取得したデータをJSON形式でクライアントに返す
    return res.status(200).json(mapPoints);
  } catch (error: any) {
    // エラーハンドリング：サーバーエラーが発生した場合はステータスコード500（サーバーエラー）を返す
    return res.status(500).json({ error: error.message });
  }
};

// 新しい地図ポイントを追加する関数
export const addMapPoint = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // リクエストのボディ（クライアントから送信されたデータ）から新しいMapPointを作成する
    const mapPoint = new MapPoint(req.body);
    // 作成したMapPointをデータベースに保存する
    await mapPoint.save();
    // ステータスコード201（作成成功）と共に保存したデータをJSON形式で返す
    return res.status(201).json(mapPoint);
  } catch (error: any) {
    // エラーハンドリング：サーバーエラーが発生した場合はステータスコード500（サーバーエラー）を返す
    return res.status(500).json({ error: error.message });
  }
};

// 指定したIDの地図ポイントを更新する関数
export const updateMapPoint = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // リクエストのパラメータから地図ポイントのIDを取得する
    const { id } = req.params;
    // 指定したIDのMapPointをデータベースで検索し、リクエストボディの内容で更新する
    // "new: true" オプションを指定することで、更新後のデータを返すようにする
    const mapPoint = await MapPoint.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // 指定したIDのMapPointが存在しない場合は、ステータスコード404（見つからない）を返す
    if (!mapPoint) {
      return res.status(404).json({ error: "Map point not found" });
    }
    // 更新が成功した場合は、ステータスコード200（成功）と共に更新後のデータをJSON形式で返す
    return res.status(200).json(mapPoint);
  } catch (error: any) {
    // エラーハンドリング：サーバーエラーが発生した場合はステータスコード500（サーバーエラー）を返す
    return res.status(500).json({ error: error.message });
  }
};

// 指定したIDの地図ポイントを削除する関数
export const deleteMapPoint = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // リクエストのパラメータから地図ポイントのIDを取得する
    const { id } = req.params;
    // 指定したIDのMapPointをデータベースで検索し、削除する
    const mapPoint = await MapPoint.findByIdAndDelete(id);
    // 指定したIDのMapPointが存在しない場合は、ステータスコード404（見つからない）を返す
    if (!mapPoint) {
      return res.status(404).json({ error: "Map point not found" });
    }
    // 削除が成功した場合は、ステータスコード200（成功）と削除成功メッセージを返す
    return res.status(200).json({ message: "Map point deleted" });
  } catch (error: any) {
    // エラーハンドリング：サーバーエラーが発生した場合はステータスコード500（サーバーエラー）を返す
    return res.status(500).json({ error: error.message });
  }
};
