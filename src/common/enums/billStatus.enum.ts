export enum BillStatus {
  PENDING = "PENDING", // (đang đợi tiếp nhận)
  CUSTOMER_PAYING = "CUSTOMER_PAYING", // (đang thanh toán)
  COMPLETED = "COMPLETED", // (đã thanh toán)
  PROVIDER_PAID = "PROVIDER_PAID", // (đã thanh toán cho provider)
  CANCEL = "CANCEL" // (hủy)
}
