import { Outlet, Link } from "react-router-dom";

import React from "react";

export default function Navbar() {
  return (
    <div>
      <header>
        <nav className="mt-5">
          <Link className="h4 mt-5 mx-2" to="/">
            首頁
          </Link>
          <Link className="h4 mt-5 mx-2" to="/product">
            產品頁面
          </Link>
          <Link className="h4 mt-5 mx-2" to="/cart">
            購物車頁面
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
