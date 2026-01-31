import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

const DeleteModal = ({ tempProduct, closeDeleteModal, handleDeleteProduct }) => {
  const modalRef = useRef(null);
  const modalInstance = useRef(null);

  useEffect(() => {
    modalInstance.current = new Modal(modalRef.current, {
      backdrop: "static",
    });

    return () => {
      if (modalInstance.current) {
        modalInstance.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (tempProduct.id) {
      modalInstance.current.show();
    } else {
      modalInstance.current.hide();
    }
  }, [tempProduct]);

  return (
    <div
      id="delProductModal"
      className="modal fade"
      ref={modalRef}
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content border-0">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">刪除產品</h5>
            <button
              type="button"
              className="btn-close bg-white"
              onClick={closeDeleteModal}
            ></button>
          </div>
          <div className="modal-body">
            是否刪除{" "}
            <strong className="text-danger">{tempProduct.title}</strong>{" "}
            (刪除後將無法恢復)。
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeDeleteModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeleteProduct}
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
