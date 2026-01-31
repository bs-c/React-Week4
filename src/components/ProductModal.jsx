import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

const ProductModal = ({
  modalMode,
  tempProduct,
  closeModal,
  handleUpdateProduct,
  handleInputChange,
  handleImageChange,
  handleAddImage,
  handleRemoveImage,
}) => {
  const modalRef = useRef(null);
  const modalInstance = useRef(null);

  useEffect(() => {
    modalInstance.current = new Modal(modalRef.current, {
      backdrop: "static",
    });

    // 清理 Modal 實例
    return () => {
      if (modalInstance.current) {
        modalInstance.current.dispose();
      }
    };
  }, []);

  // 外部控制 Modal 的顯示和隱藏
  useEffect(() => {
    if (modalMode) {
      modalInstance.current.show();
    } else {
      modalInstance.current.hide();
    }
  }, [modalMode]);

  return (
    <div
      id="productModal"
      className="modal fade"
      ref={modalRef}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">
              {modalMode === "create" ? "新增產品" : "編輯產品"}
            </h5>
            <button
              type="button"
              className="btn-close bg-white"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              {/* 左側：圖片區塊 */}
              <div className="col-sm-4">
                <div className="mb-3">
                  <label className="form-label">主要圖片</label>
                  <input
                    name="imageUrl"
                    type="text"
                    className="form-control mb-2"
                    placeholder="請輸入圖片連結"
                    value={tempProduct.imageUrl || ""}
                    onChange={handleInputChange}
                  />
                  {tempProduct.imageUrl && (
                    <img
                      className="img-fluid"
                      src={tempProduct.imageUrl}
                      alt="主圖"
                    />
                  )}
                </div>

                {/* 多圖渲染區 */}
                {tempProduct.imagesUrl?.map((url, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder={`圖片網址 ${index + 1}`}
                      value={url}
                      onChange={(e) =>
                        handleImageChange(index, e.target.value)
                      }
                    />
                    {url && (
                      <img
                        src={url}
                        alt={`副圖 ${index + 1}`}
                        className="img-fluid mb-2"
                      />
                    )}
                  </div>
                ))}

                <div className="d-flex justify-content-between gap-2">
                  {/* 只有當最後一張圖有值，或完全沒圖時，才顯示新增按鈕 */}
                  {(!tempProduct.imagesUrl?.length ||
                    tempProduct.imagesUrl[
                      tempProduct.imagesUrl.length - 1
                    ]) && (
                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={handleAddImage}
                    >
                      新增圖片
                    </button>
                  )}
                  {tempProduct.imagesUrl?.length > 0 && (
                    <button
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={handleRemoveImage}
                    >
                      刪除圖片
                    </button>
                  )}
                </div>
              </div>

              {/* 右側：表單區塊 */}
              <div className="col-sm-8">
                <div className="mb-3">
                  <label className="form-label">標題</label>
                  <input
                    name="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                    value={tempProduct.title || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="form-label">分類</label>
                    <input
                      name="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                      value={tempProduct.category || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">單位</label>
                    <input
                      name="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                      value={tempProduct.unit || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="form-label">原價</label>
                    <input
                      name="origin_price"
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="請輸入原價"
                      value={tempProduct.origin_price || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">售價</label>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="請輸入售價"
                      value={tempProduct.price || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <hr />
                <div className="mb-3">
                  <label className="form-label">產品描述</label>
                  <textarea
                    name="description"
                    className="form-control"
                    placeholder="請輸入產品描述"
                    value={tempProduct.description || ""}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">說明內容</label>
                  <textarea
                    name="content"
                    className="form-control"
                    placeholder="請輸入說明內容"
                    value={tempProduct.content || ""}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      name="is_enabled"
                      className="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      checked={!!tempProduct.is_enabled}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateProduct}
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
