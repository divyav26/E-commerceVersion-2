import { toast, ToastOptions } from "react-toastify";

const toastOptions: ToastOptions = {
	position: "top-center",
	autoClose: 3000,
	draggable: true,
	className: " !text-xs font-semibold !text-black !rounded-lg",
	hideProgressBar: true,
};

export const showErrorToast = (message: string): void => {
	toast.error(message, toastOptions);
};

export const showSuccessToast = (message: string): void => {
	toast.success(message, toastOptions);
};

export const showWarningToast = (message: string): void => {
	toast.warning(message, toastOptions);
};

export const showInfoToast = (message: string): void => {
	toast.info(message, toastOptions);
};