-- Align Payment.orderId FK with schema: ON DELETE RESTRICT
-- (an order deletion must never silently detach its payment)
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
