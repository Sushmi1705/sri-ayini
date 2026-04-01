import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../src/layout/Layout";
import PageBanner from "../src/components/PageBanner";

const OrderSuccess = () => {
  const router = useRouter();
  const { orderId, total } = router.query;

  return (
    <Layout>
      <PageBanner pageName={"Order Confirmed"} />
      <div className="py-130 rpy-100">
        <div className="container">
          <div
            style={{
              maxWidth: "720px",
              margin: "0 auto",
              background: "#fff",
              borderRadius: "18px",
              padding: "48px 36px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "74px",
                height: "74px",
                borderRadius: "50%",
                margin: "0 auto 18px",
                background: "#f1faeb",
                color: "#5a9c22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
              }}
            >
              <i className="fas fa-check" />
            </div>
            <h2 style={{ marginBottom: "12px" }}>Your order is confirmed</h2>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              Thank you for shopping with Sri Ayini. We have received your order and will start processing it shortly.
            </p>
            {orderId && <p style={{ marginBottom: "8px" }}><strong>Order ID:</strong> {orderId}</p>}
            {total && <p style={{ marginBottom: "28px" }}><strong>Order Total:</strong> ₹{total}</p>}
            <div className="d-flex justify-content-center flex-wrap" style={{ gap: "14px" }}>
              <Link legacyBehavior href="/profile">
                <a className="theme-btn">View My Orders</a>
              </Link>
              <Link legacyBehavior href="/product-details">
                <a className="theme-btn style-two">Continue Shopping</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
