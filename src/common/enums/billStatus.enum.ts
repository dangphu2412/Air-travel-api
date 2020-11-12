export enum BillStatus {
  PENDING = "PENDING", // (đang đợi tiếp nhận)
  CUSTOMER_PAYING = "CUSTOMER_PAYING", // (đang thanh toán)
  CUSTOMER_PAID = "CUSTOMER_PAID", // (customer đã thanh toán xong)
  PROVIDER_PAID = "PROVIDER_PAID", // (đã thanh toán cho provider)
  COMPLETED = "COMPLETED", // (đơn đã hoàn tất)
  CANCEL = "CANCEL" // (hủy)
}
