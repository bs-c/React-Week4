import { useState, useEffect } from "react";
import axios from "axios";

import ProductModal from "./components/ProductModal";
import DeleteModal from "./components/DeleteModal";

// API 環境變數
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// 產品資料的預設值
const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [],
};

function App() {
  // ===================== 狀態宣告 =====================

  // 登入狀態與使用者資料
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});

  // Modal 相關狀態
  // modalMode: 用來判斷當前是 'create' (新增), 'edit' (編輯), 還是 null
  const [modalMode, setModalMode] = useState(null);
  // tempProduct: 暫存當前 Modal 要顯示/編輯的產品資料
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  // deleteProduct: 專門給刪除 Modal 使用的狀態
  const [deleteProduct, setDeleteProduct] = useState({});

  // 登入表單狀態
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // ===================== 初始化 =====================
  //檢查登入
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = document.cookie.replace(
          /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
          "$1",
        );
        if (token) {
          axios.defaults.headers.common.Authorization = token;
          await axios.post(`${API_BASE}/api/user/check`);
          setIsAuth(true); // 登入成功，切換 isAuth 為 true
        }
      } catch (err) {
        console.error("驗證失敗", err);
      }
    };
    checkAdmin();
  }, []);

  // 登入成功後，取得第一頁的產品資料
  useEffect(() => {
    if (isAuth) {
      getProducts();
    }
  }, [isAuth]);

  // ===================== API 邏輯區 =====================

  // 取得產品列表
  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      alert("取得產品失敗: " + err.response?.data?.message);
    }
  };

  // 登入功能
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, loginData);
      const { token, expired } = res.data;
      // 寫入 Cookie
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;

      setIsAuth(true);
    } catch (err) {
      alert("登入失敗: " + err.response?.data?.message);
    }
  };

  // 新增或更新產品
  const handleUpdateProduct = async () => {
    // 根據 modalMode 決定 API 路徑與方法
    const apiCall =
      modalMode === "create"
        ? `${API_BASE}/api/${API_PATH}/admin/product`
        : `${API_BASE}/api/${API_PATH}/admin/product/${tempProduct.id}`;

    const method = modalMode === "create" ? "post" : "put";

    // 整理傳送的資料格式 (轉型別)
    const dataPayload = {
      data: {
        ...tempProduct,
        origin_price: Number(tempProduct.origin_price),
        price: Number(tempProduct.price),
        is_enabled: tempProduct.is_enabled ? 1 : 0,
      },
    };

    try {
      await axios[method](apiCall, dataPayload);
      alert(modalMode === "create" ? "新增成功" : "更新成功");
      closeModal();
      getProducts(); // 重新撈取列表
    } catch (err) {
      alert("操作失敗: " + err.response?.data?.message);
    }
  };

  // 刪除產品
  const handleDeleteProduct = async () => {
    try {
      await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${deleteProduct.id}`,
      );
      alert("刪除成功");
      closeDeleteModal();
      getProducts();
    } catch (err) {
      alert("刪除失敗: " + err.response?.data?.message);
    }
  };

  // ===================== Modal 控制與表單處理區 =====================

  // 開啟產品 Modal (新增或編輯)
  const openProductModal = (mode, product) => {
    setModalMode(mode);
    if (mode === "create") {
      setTempProduct(defaultModalState); // 重置為空值
    } else {
      setTempProduct({ ...product }); // 複製選中的產品資料
    }
  };

  // 關閉產品 Modal
  const closeModal = () => {
    setModalMode(null); // 只要把 modalMode 設回 null，Modal 就會自己關閉
  };

  // 開啟刪除 Modal
  const openDeleteModal = (product) => {
    setDeleteProduct(product);
  };

  const closeDeleteModal = () => {
    setDeleteProduct({}); // 清空 deleteProduct，Modal 就會自己關閉
  };

  // 通用的 Input 變更處理
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  // 圖片變更處理 (針對多圖陣列)
  const handleImageChange = (index, value) => {
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value;
    setTempProduct((prev) => ({ ...prev, imagesUrl: newImages }));
  };

  // 新增一張空圖片欄位
  const handleAddImage = () => {
    const newImages = [...(tempProduct.imagesUrl || []), ""];
    setTempProduct((prev) => ({ ...prev, imagesUrl: newImages }));
  };

  // 移除最後一張圖片
  const handleRemoveImage = () => {
    const newImages = [...tempProduct.imagesUrl];
    newImages.pop();
    setTempProduct((prev) => ({ ...prev, imagesUrl: newImages }));
  };

  // 登入畫面 Input 處理
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // ===================== 畫面渲染 =====================

  // 1. 如果未登入，顯示登入頁面
  if (!isAuth) {
    return (
      <div className="container login mt-5">
        <div className="row justify-content-center">
          <div className="col-8">
            <h1 className="h3 mb-3 font-weight-normal text-center">請先登入</h1>
            <form onSubmit={handleLogin}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="username"
                  name="username" // 加上 name 屬性方便共用 handler
                  placeholder="name@example.com"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  required
                />
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
                <label htmlFor="password">Password</label>
              </div>
              <button
                className="btn btn-lg btn-primary w-100 mt-3"
                type="submit"
              >
                登入
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 2. 如果已登入，顯示產品後台
  return (
    <div className="container">
      {/* 新增按鈕 */}
      <div className="text-end mt-4">
        <button
          className="btn btn-primary"
          onClick={() => openProductModal("create")}
        >
          建立新的產品
        </button>
      </div>

      {/* 產品列表表格 */}
      <table className="table mt-4">
        <thead>
          <tr>
            <th width="120">分類</th>
            <th>產品名稱</th>
            <th width="120">原價</th>
            <th width="120">售價</th>
            <th width="100">是否啟用</th>
            <th width="120">編輯</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.category}</td>
              <td>{product.title}</td>
              <td className="text-end">{product.origin_price}</td>
              <td className="text-end">{product.price}</td>
              <td>
                {product.is_enabled ? (
                  <span className="text-success">啟用</span>
                ) : (
                  <span>未啟用</span>
                )}
              </td>
              <td>
                <div className="btn-group">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => openProductModal("edit", product)}
                  >
                    編輯
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => openDeleteModal(product)}
                  >
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 新增/編輯 Modal */}
      <ProductModal
        modalMode={modalMode}
        tempProduct={tempProduct}
        closeModal={closeModal}
        handleUpdateProduct={handleUpdateProduct}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
      />

      {/* 刪除確認 Modal */}
      <DeleteModal
        tempProduct={deleteProduct}
        closeDeleteModal={closeDeleteModal}
        handleDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
}

export default App;
