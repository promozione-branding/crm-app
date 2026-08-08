"use client";

import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CalendarDays, Clock3 } from "lucide-react";

export default function DateTimeInput({
    name,
    label,
    required = false,
    value,
    onChange,
    placeholder = "Pick date & time",
    error,
    minDate,
    maxDate,
    disabled = false,
}) {
    const pickerValue = value ? dayjs(value) : null;

    const handleChange = (newValue) => {
        if (!newValue || !newValue.isValid()) {
            onChange?.({
                target: {
                    name,
                    value: "",
                },
            });
            return;
        }

        onChange?.({
            target: {
                name,
                value: newValue.toISOString(),
            },
        });
    };

    return (
        <div className="w-full relative">
            {/* Label */}
            {label && (
                <label className="block text-sm font-medium text-app mb-1">
                    {label}

                    {required && (
                        <span className="text-red-500 ml-1">*</span>
                    )}
                </label>
            )}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    value={pickerValue}
                    onChange={handleChange}
                    disabled={disabled}
                    minDate={minDate ? dayjs(minDate) : undefined}
                    maxDate={maxDate ? dayjs(maxDate) : undefined}
                    ampm
                    closeOnSelect={false}
                    format="D MMM YYYY hh:mm A"
                    minutesStep={5}
                    views={["year", "month", "day", "hours", "minutes"]}
                    localeText={{
                        okButtonLabel: "Done",
                        cancelButtonLabel: "Cancel",
                    }}
                    slotProps={{
                        /* =========================
                           INPUT
                        ========================= */
                        textField: {
                            fullWidth: true,
                            placeholder,
                            size: "small",
                            error: !!error,

                            InputProps: {
                                startAdornment: (
                                    <CalendarDays
                                        size={17}
                                        className="mr-2 text-muted"
                                    />
                                ),
                            },

                            sx: {
                                "& .MuiOutlinedInput-root": {
                                    height: "36px",
                                    borderRadius: "8px",
                                    backgroundColor: "var(--surface)",

                                    "& fieldset": {
                                        borderColor: "var(--border)",
                                    },

                                    "&:hover fieldset": {
                                        borderColor: "var(--primary)",
                                    },

                                    "&.Mui-focused fieldset": {
                                        borderColor: "var(--primary)",
                                        borderWidth: "1px",
                                    },
                                },

                                "& .MuiInputBase-input": {
                                    color: "var(--text)",
                                    fontSize: "13px",
                                    padding: "7px 10px",

                                    "&::placeholder": {
                                        color: "var(--text-secondary)",
                                        opacity: 1,
                                    },
                                },

                                "& .MuiInputAdornment-root": {
                                    color: "var(--text-secondary)",
                                },

                                "& .MuiIconButton-root": {
                                    color: "var(--text-secondary)",
                                },

                                "& .MuiInputBase-input.Mui-disabled": {
                                    WebkitTextFillColor:
                                        "var(--text-secondary)",
                                },
                            },
                        },

                        /* =========================
                           POPPER
                        ========================= */
                        popper: {
                            placement: "bottom-start",

                            sx: {
                                zIndex: 99999,

                                /* Main popup */
                                "& .MuiPaper-root": {
                                    width: "490px !important",
                                    minWidth: "490px !important",

                                    backgroundColor: "var(--surface)",
                                    color: "var(--text)",

                                    border: "1px solid var(--border)",
                                    borderRadius: "12px",

                                    overflow: "hidden",

                                    boxShadow:
                                        "0 12px 40px rgba(0, 0, 0, 0.35)",
                                },

                                /* =========================
                                   PICKER LAYOUT
                                ========================= */
                                "& .MuiPickersLayout-root": {
                                    width: "490px !important",
                                    minWidth: "490px !important",
                                    backgroundColor: "var(--surface)",
                                },

                                /*
                                 * Calendar + Time wrapper
                                 */
                                "& .MuiPickersLayout-contentWrapper": {
                                    display: "flex",
                                    width: "100%",
                                },

                                /* =========================
                                   CALENDAR
                                ========================= */
                                "& .MuiDateCalendar-root": {
                                    width: "300px !important",
                                    minWidth: "300px !important",

                                    height: "340px",

                                    margin: 0,
                                    padding: "10px 12px",

                                    backgroundColor: "var(--surface)",
                                },

                                /* Calendar header */
                                "& .MuiPickersCalendarHeader-root": {
                                    height: "45px",

                                    padding: "0 4px",
                                    margin: 0,

                                    display: "flex",
                                    alignItems: "center",
                                },

                                "& .MuiPickersCalendarHeader-label": {
                                    color: "var(--text)",

                                    fontSize: "15px",
                                    fontWeight: 600,
                                },

                                "& .MuiPickersArrowSwitcher-button": {
                                    color: "var(--text-secondary)",
                                    padding: "6px",

                                    "&:hover": {
                                        backgroundColor: "var(--hover)",
                                    },
                                },

                                /* Week names */
                                "& .MuiDayCalendar-header": {
                                    marginTop: "4px",
                                    marginBottom: "4px",
                                },

                                "& .MuiDayCalendar-weekDayLabel": {
                                    width: "36px",
                                    height: "30px",

                                    color: "var(--text-secondary)",

                                    fontSize: "11px",
                                    fontWeight: 600,
                                },

                                /* Calendar days */
                                "& .MuiDayCalendar-monthContainer": {
                                    width: "100%",
                                },

                                "& .MuiPickersDay-root": {
                                    width: "36px",
                                    height: "36px",

                                    margin: "1px",

                                    color: "var(--text)",

                                    fontSize: "13px",

                                    borderRadius: "7px",

                                    "&:hover": {
                                        backgroundColor: "var(--hover)",
                                    },
                                },

                                /* Selected date */
                                "& .MuiPickersDay-root.Mui-selected": {
                                    backgroundColor: "var(--primary)",
                                    color: "#fff",

                                    "&:hover": {
                                        backgroundColor: "var(--primary)",
                                    },
                                },

                                /* Today */
                                "& .MuiPickersDay-today": {
                                    borderColor: "var(--primary)",
                                },

                                /* =========================
                                   TIME SECTION
                                ========================= */
                                "& .MuiMultiSectionDigitalClock-root": {
                                    width: "190px !important",
                                    minWidth: "190px !important",

                                    maxHeight: "340px",

                                    borderLeft:
                                        "1px solid var(--border)",

                                    backgroundColor: "var(--surface)",

                                    padding: "12px 8px",
                                },

                                /* Each time column */
                                "& .MuiMultiSectionDigitalClockSection-root":
                                    {
                                        width: "58px !important",
                                    },

                                /* Time items */
                                "& .MuiMultiSectionDigitalClockSection-item":
                                    {
                                        width: "48px !important",
                                        minWidth: "48px !important",

                                        height: "40px !important",
                                        minHeight: "40px !important",

                                        margin: "2px 0",

                                        padding: 0,

                                        borderRadius: "7px",

                                        color: "var(--text)",

                                        fontSize: "13px",

                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        "&:hover": {
                                            backgroundColor: "var(--hover)",
                                        },
                                    },

                                /* Selected time */
                                "& .MuiMultiSectionDigitalClockSection-item.Mui-selected":
                                    {
                                        backgroundColor: "var(--primary)",
                                        color: "#fff",

                                        "&:hover": {
                                            backgroundColor:
                                                "var(--primary)",
                                        },
                                    },

                                /* =========================
                                   FOOTER
                                ========================= */
                                "& .MuiPickersLayout-actionBar": {
                                    width: "100%",

                                    minHeight: "54px",

                                    padding: "8px 14px",

                                    borderTop:
                                        "1px solid var(--border)",

                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",

                                    backgroundColor: "var(--surface)",
                                },

                                "& .MuiPickersLayout-actionBar .MuiButton-root":
                                    {
                                        minWidth: "68px",

                                        height: "32px",

                                        padding: "5px 14px",

                                        borderRadius: "7px",

                                        backgroundColor:
                                            "var(--primary)",

                                        color: "#fff",

                                        fontSize: "12px",
                                        fontWeight: 600,

                                        textTransform: "none",

                                        "&:hover": {
                                            backgroundColor:
                                                "var(--primary)",
                                            opacity: 0.9,
                                        },
                                    },

                                /* =========================
                                   SHORTCUTS / TODAY
                                ========================= */
                                "& .MuiPickersShortcuts-root": {
                                    padding: "8px 14px",

                                    borderTop:
                                        "1px solid var(--border)",
                                },

                                "& .MuiPickersShortcuts-root .MuiChip-root":
                                    {
                                        color: "var(--primary)",

                                        backgroundColor:
                                            "transparent",

                                        fontSize: "12px",

                                        fontWeight: 600,

                                        "&:hover": {
                                            backgroundColor:
                                                "var(--hover)",
                                        },
                                    },
                            },
                        },

                        /* =========================
                           ACTION BAR
                        ========================= */
                        actionBar: {
                            actions: ["accept"],
                        },

                        /* =========================
                           TODAY BUTTON
                        ========================= */
                        shortcuts: {
                            items: [
                                {
                                    label: "Today",
                                    getValue: () => dayjs(),
                                },
                            ],
                        },
                    }}
                />
            </LocalizationProvider>

            {/* Error */}
            {error && (
                <p className="text-red-500 text-xs mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}