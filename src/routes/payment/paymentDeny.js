import express from "express";
import Payment from "../../models/paymentModel.js"; // Payment 모델 가져오기

const router = express.Router();

/**
 * @swagger
 * /payment/paymentDeny:
 *   put:
 *     summary: 결제 승인 거부
 *     description: paymentId를 이용해 결제의 승인 상태를 false로 변경합니다.
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: 결제 문서의 ObjectId
 *     responses:
 *       200:
 *         description: 결제 승인 상태 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: string
 *                   example: SUCCESS-0000
 *                 message:
 *                   type: string
 *                   example: 결제 승인 상태가 성공적으로 변경되었습니다.
 *                 result:
 *                   type: object
 *                   properties:
 *                     paymentId:
 *                       type: string
 *                       example: "660f748dbe3d7cd8fd678ee4"
 *                     paymentPermissionStatus:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: paymentId 누락
 *         content:
 *           application/json:
 *             example:
 *               isSuccess: false
 *               code: ERROR-0001
 *               message: paymentId가 누락되었습니다.
 *               result: []
 *       404:
 *         description: 결제 정보 없음
 *         content:
 *           application/json:
 *             example:
 *               isSuccess: false
 *               code: ERROR-0003
 *               message: 해당 결제 정보를 찾을 수 없습니다.
 *               result: []
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             example:
 *               isSuccess: false
 *               code: ERROR-0002
 *               message: 서버 오류
 *               result: []
 */

// 결제 승인 상태 변경 (PUT 방식)
router.put("/payment/paymentDeny", async (req, res) => {
  const { paymentId } = req.query; // 쿼리 스트링에서 paymentId 받기

  if (!paymentId) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "paymentId가 누락되었습니다.",
      result: [],
    });
  }

  try {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "해당 결제 정보를 찾을 수 없습니다.",
        result: [],
      });
    }

    payment.paymentPermissionStatus = false;
    await payment.save();

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "결제 승인 상태가 성공적으로 변경되었습니다.",
      result: {
        paymentId: payment._id,
        paymentPermissionStatus: payment.paymentPermissionStatus,
      },
    });
  } catch (error) {
    console.error("❌ 서버 오류:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0002",
      message: "서버 오류",
      result: [],
    });
  }
});

export default router;
