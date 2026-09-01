"use client";

import { useRef, useState } from "react";
import axios from "axios";
import {
    Upload,
    Download,
    FileSpreadsheet,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "@/components/user/ui/Modal";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ImportLeadsModal({
    open,
    setOpen,
    onSuccess,
}) {
    const fileInputRef = useRef(null);

    const [step, setStep] = useState(1);
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Close Modal
    const handleClose = () => {
        if (uploading) return;

        setStep(1);
        setFile(null);
        setDragging(false);

        setOpen(false);
    };

    // Select Excel File
    const handleFile = (selectedFile) => {
        if (!selectedFile) return;

        const fileName =
            selectedFile.name?.toLowerCase().trim() || "";

        const isExcel =
            fileName.endsWith(".xlsx") ||
            fileName.endsWith(".xls");

        if (!isExcel) {
            toast.error(
                "Please upload an Excel file (.xlsx or .xls)."
            );
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            toast.error(
                "File size cannot exceed 10MB."
            );
            return;
        }

        setFile(selectedFile);

        toast.success(
            "Excel file selected successfully."
        );
    };

    // File Input
    const handleFileChange = (event) => {
        const selectedFile =
            event.target.files?.[0];

        handleFile(selectedFile);

        event.target.value = "";
    };

    // Drag & Drop
    const handleDrop = (event) => {
        event.preventDefault();

        setDragging(false);

        const droppedFile =
            event.dataTransfer.files?.[0];

        handleFile(droppedFile);
    };

    // Download Sample Excel
    const handleDownloadSample = async () => {
        let loadingToast;

        try {
            loadingToast = toast.loading(
                "Preparing sample Excel..."
            );

            const response = await axios.get(
                "/api/user/lead/sample-csv",
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;
            link.download =
                "lead-import-template.xlsx";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            toast.dismiss(loadingToast);

            toast.success(
                "Sample Excel downloaded."
            );
        } catch (error) {
            console.error(
                "Sample Excel download error:",
                error
            );

            if (loadingToast) {
                toast.dismiss(loadingToast);
            }

            toast.error(
                error?.response?.data?.message ||
                "Failed to download sample Excel."
            );
        }
    };

    // Upload Excel
    const handleUpload = async () => {
        if (!file) {
            toast.error(
                "Please select an Excel file."
            );
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();

            formData.append("file", file);

            const loadingToast =
                toast.loading(
                    "Importing leads..."
                );

            const response =
                await axios.post(
                    "/api/user/lead/bulk-import",
                    formData
                );

            toast.dismiss(loadingToast);

            const result = response.data;

            if (!result.success) {
                throw new Error(
                    result.message ||
                    "Failed to import leads."
                );
            }

            const imported =
                result.data?.imported || 0;

            const failed =
                result.data?.failed || 0;

            toast.success(
                `${imported} leads imported successfully.`
            );

            if (failed > 0) {
                toast.error(
                    `${failed} rows failed.`
                );
            }

            onSuccess?.(result.data);

            setStep(2);
        } catch (error) {
            console.error(
                "Lead import error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error.message ||
                "Failed to import leads."
            );
        } finally {
            setUploading(false);
        }
    };

    // Next
    const handleNext = () => {
        if (step === 1) {
            handleUpload();
            return;
        }

        if (step === 2) {
            setStep(3);
        }
    };

    // Back
    const handleBack = () => {
        if (step === 1) {
            handleClose();
            return;
        }

        setStep((prev) => prev - 1);
    };

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            size="xl"
        >
            <Modal.Header>
                <div>
                    <h2 className="text-lg font-semibold">
                        Import Leads
                    </h2>

                    <p className="mt-1 text-xs font-normal text-muted">
                        Step {step} of 3:{" "}
                        {step === 1
                            ? "Upload"
                            : step === 2
                                ? "Field Mapping"
                                : "Bulk Options"}
                    </p>
                </div>
            </Modal.Header>

            <Modal.Body>
                {/* Step Header */}
                <div className="mb-6 flex items-center">
                    {/* Step 1 */}
                    <div className="flex items-center gap-2">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step >= 1
                                    ? "bg-primary text-white"
                                    : "bg-app text-muted"
                                }`}
                        >
                            1
                        </div>

                        <span
                            className={`text-sm font-medium ${step >= 1
                                    ? "text-app"
                                    : "text-muted"
                                }`}
                        >
                            Upload
                        </span>
                    </div>

                    <div className="mx-4 h-px flex-1 bg-app" />

                    {/* Step 2 */}
                    <div className="flex items-center gap-2">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step >= 2
                                    ? "bg-primary text-white"
                                    : "bg-app text-muted"
                                }`}
                        >
                            2
                        </div>

                        <span
                            className={`text-sm font-medium ${step >= 2
                                    ? "text-app"
                                    : "text-muted"
                                }`}
                        >
                            Field Mapping
                        </span>
                    </div>

                    <div className="mx-4 h-px flex-1 bg-app" />

                    {/* Step 3 */}
                    <div className="flex items-center gap-2">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step >= 3
                                    ? "bg-primary text-white"
                                    : "bg-app text-muted"
                                }`}
                        >
                            3
                        </div>

                        <span
                            className={`text-sm font-medium ${step >= 3
                                    ? "text-app"
                                    : "text-muted"
                                }`}
                        >
                            Bulk Options
                        </span>
                    </div>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragging(true);
                            }}
                            onDragLeave={() => {
                                setDragging(false);
                            }}
                            onDrop={handleDrop}
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed transition ${dragging
                                    ? "border-primary bg-primary/5"
                                    : "border-app hover:border-primary/50 hover-app"
                                }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                onChange={
                                    handleFileChange
                                }
                                className="hidden"
                            />

                            {file ? (
                                <>
                                    <div className="mb-4 rounded-xl bg-primary/10 p-4 text-primary">
                                        <FileSpreadsheet
                                            size={38}
                                        />
                                    </div>

                                    <p className="text-base font-semibold text-app">
                                        {file.name}
                                    </p>

                                    <p className="mt-1 text-sm text-muted">
                                        {(
                                            file.size / 1024
                                        ).toFixed(1)}{" "}
                                        KB
                                    </p>

                                    <p className="mt-3 text-sm text-primary">
                                        Click to change file
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Upload
                                        size={48}
                                        strokeWidth={1.5}
                                        className="mb-5 text-muted"
                                    />

                                    <p className="text-base font-semibold text-app">
                                        Drop Excel file here
                                        or click to browse
                                    </p>

                                    <p className="mt-2 text-sm text-muted">
                                        Accepted: XLSX, XLS —
                                        Max 10MB
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Download Sample */}
                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={
                                    handleDownloadSample
                                }
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:opacity-80"
                            >
                                <Download size={17} />

                                Download Sample Excel
                            </button>

                            <p className="mt-1 text-xs text-muted">
                                Download the Excel template
                                and fill in your lead details.
                            </p>
                        </div>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div className="min-h-[250px]">
                        <h3 className="mb-2 text-base font-semibold text-app">
                            Field Mapping
                        </h3>

                        <p className="text-sm text-muted">
                            Map the Excel columns to your
                            lead fields.
                        </p>

                        <div className="mt-5 rounded-xl border border-app p-4">
                            <p className="text-sm text-app">
                                File:
                            </p>

                            <p className="mt-1 text-sm text-muted">
                                {file?.name}
                            </p>
                        </div>
                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div className="min-h-[250px]">
                        <h3 className="mb-2 text-base font-semibold text-app">
                            Bulk Options
                        </h3>

                        <p className="text-sm text-muted">
                            Configure your bulk import
                            options.
                        </p>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <button
                    type="button"
                    onClick={handleBack}
                    disabled={uploading}
                    className="flex h-10 items-center gap-2 rounded-lg border border-app px-4 text-sm font-medium text-app transition hover-app disabled:opacity-50"
                >
                    <ChevronLeft size={17} />

                    {step === 1
                        ? "Cancel"
                        : "Back"}
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={
                        uploading ||
                        (step === 1 && !file)
                    }
                    className="flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {uploading ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                            Uploading...
                        </>
                    ) : (
                        <>
                            Next

                            <ChevronRight size={17} />
                        </>
                    )}
                </button>
            </Modal.Footer>
        </Modal>
    );
}