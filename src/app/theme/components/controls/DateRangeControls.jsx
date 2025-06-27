import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { format } from "date-fns";
import { es as esLocale } from "date-fns/locale";
import { getPaletteConfig, fluidCSS, driverParams } from "@framework";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { AutoSkeleton } from "../controls.jsx";

let START_DATE, END_DATE, PERIOD, MONTH, WEEK;

export function DateRangeControls({
  type = "select",
  dateRangeInit,
  dateRangeFin,
  setDateRangeInit,
  setDateRangeFin,
  loading,
  period = "most_recent", // day, week, month
  willPeriodChange = (period) => {},
}) {
  // Inicializar parámetros de URL como driverParams
  let _period_;
  [
    START_DATE, // fecha inicio
    END_DATE, // fecha fin
    _period_, // periodo
    WEEK, // semana
    MONTH, // mes
    WEEK, // semana
  ] = driverParams.gets(
    "start_date",
    "end_date",
    "period",
    "week",
    "month",
    "week"
  );
  PERIOD = _period_ || period;
  if (START_DATE) {
    const initDate = dayjs(START_DATE);
    MONTH = initDate.month();
    MONTH ??= Math.floor(initDate.date() / 7);
    WEEK ??= Math.floor(initDate.date() / 7);
  } else {
    MONTH ??= dayjs().month();
    WEEK ??= getInitWeek(dayjs().month());
  }

  driverParams.sets({
    month: MONTH,
    week: WEEK,
    period: PERIOD,
  });

  // Migrar estados a useState para que los selectores sean reactivos
  const [periodValue, setPeriodValue] = useState(PERIOD);
  const [selectedDate, setSelectedDate] = useState(dayjs(START_DATE));
  const [selectedMonth, setSelectedMonth] = useState(+MONTH);
  const [selectedWeek, setSelectedWeek] = useState(+WEEK);

  // Configurar dayjs para español
  dayjs.locale(es);

  const handlePeriodChange = (event) => {
    const value = event?.target?.value || periodValue;
    willPeriodChange(value);
    if (value === "most_recent") {
      setPeriodValue(value);
      driverParams.sets({ period: value });
      // no date filters for most_recent
      return;
    }
    setPeriodValue(value);
    const day_value = dayjs(START_DATE);
    setSelectedDate(day_value);
    const day_value_string = day_value.format("YYYY-MM-DD");
    if (value === "day") {
      driverParams.sets({
        start_date: day_value_string,
        end_date: day_value_string,
      });
    }
    const iw = getInitWeek(day_value.month());
    setSelectedWeek(iw);
    let init;
    const end = day_value;
    setDateRangeFin(end);

    switch (value) {
      case "day":
        init = day_value.startOf("day");
        break;
      case "week":
        init = day_value.startOf("week");
        break;
      case "month":
        init = day_value.startOf("month");
        break;
      default:
        init = day_value.startOf("day");
    }
    setDateRangeInit(init);
    driverParams.sets({
      month: day_value.month(),
      period: value,
      week: iw,
      start_date: init.format("YYYY-MM-DD"),
      end_date: end.format("YYYY-MM-DD"),
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const d = dayjs(date).format("YYYY-MM-DD");
    driverParams.sets({
      start_date: d,
      end_date: d,
    });
    setDateRangeInit(date);
    setDateRangeFin(date);
  };

  // Sync dateRange when date param changes
  useEffect(() => {
    if (periodValue === "day") {
      setDateRangeInit(selectedDate);
      setDateRangeFin(selectedDate);
    }
  }, [selectedDate, periodValue]);

  const getWeekRange = (month, week) => {
    const daysInMonth = dayjs().month(month).daysInMonth();

    switch (week) {
      case 1:
        return { start: 1, end: 7 };
      case 2:
        return { start: 8, end: 14 };
      case 3:
        return { start: 15, end: 21 };
      case 4:
        return { start: 22, end: daysInMonth };
      default:
        return { start: 1, end: 7 };
    }
  };

  const handleWeekChange = (week) => {
    setSelectedWeek(week);
    const { start, end } = getWeekRange(selectedMonth, week);
    const date = dayjs().month(selectedMonth).date(start);

    // Verificar si el rango está en el futuro
    const today = dayjs();
    let startDate, endDate;
    if (date.isAfter(today)) {
      // Si el inicio está en el futuro, usar la fecha actual
      setDateRangeInit(today);
      setDateRangeFin(today);
      startDate = today;
      endDate = today;
    } else {
      // Si está en el pasado o presente, usar el rango normal
      setDateRangeInit(date);
      setDateRangeFin(date.date(end));
      startDate = date;
      endDate = date.date(end);
    }
    driverParams.sets({
      week: week,
      month: selectedMonth,
      start_date: startDate.format("YYYY-MM-DD"),
      end_date: endDate.format("YYYY-MM-DD"),
    });
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    const iw2 = getInitWeek(month);
    setSelectedWeek(iw2);
    const date = dayjs().month(month);
    const start = date.startOf("month");
    const end = date.endOf("month");
    setDateRangeInit(start);
    setDateRangeFin(end);
    driverParams.sets({
      month: month,
      week: iw2,
      start_date: start.format("YYYY-MM-DD"),
      end_date: end.format("YYYY-MM-DD"),
    });
  };
  // Ejecutar handlePeriodChange al montar el componente
  useEffect(() => {
    // Solo inicializa si las fechas no están definidas
    if (!dateRangeInit || !dateRangeFin) {
      const now = dayjs();
      setDateRangeFin(now);
      setDateRangeInit(now.startOf("day"));
      handlePeriodChange();
    }
  }, []);

  // Si el tipo es "none", no mostrar ningún control
  if (type === "none") {
    return null;
  }

  // Si el tipo es "custom", mostrar los selectores de fecha personalizados
  if (type === "custom") {
    return (
      <div className="flex align-stretch flex-wrap gap-20px">
        <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
          <AutoSkeleton h="10vh" w="250px" loading={loading}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                className="fullWidth"
                label="Fecha inicio"
                value={dateRangeInit}
                onChange={(date) => setDateRangeInit(date)}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
          </AutoSkeleton>
        </div>
        <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
          <AutoSkeleton h="10vh" w="250px" loading={loading}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                className="fullWidth"
                label="Fecha Fin"
                value={dateRangeFin}
                onChange={(date) => setDateRangeFin(date)}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
          </AutoSkeleton>
        </div>
      </div>
    );
  }

  // Implementación con Select (opción por defecto)
  const palette_config = getPaletteConfig();
  return (
    <div className="flex align-stretch flex-wrap gap-20px">
      <AutoSkeleton h="10vh" w="150px" loading={loading}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="period-select-label">Período</InputLabel>
          <Select
            labelId="period-select-label"
            id="period-select"
            value={periodValue}
            onChange={handlePeriodChange}
            label="Período"
            MenuProps={{
              disableScrollLock: true, // Evita que se bloquee el scroll
            }}
          >
            <MenuItem value="most_recent">Más recientes</MenuItem>
            <MenuItem value="day">1 día</MenuItem>
            <MenuItem value="week">1 semana</MenuItem>
            <MenuItem value="month">1 mes</MenuItem>
          </Select>
        </FormControl>
      </AutoSkeleton>

      {periodValue === "day" && (
        <AutoSkeleton h="10vh" w="200px" loading={loading}>
          <div style={{ width: "200px", display: "inline-block" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                className="fullWidth"
                label="Seleccionar día"
                value={selectedDate}
                onChange={handleDateChange}
                views={["year", "month", "day"]}
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "outlined",
                  },
                }}
                maxDate={dayjs()}
              />
            </LocalizationProvider>
          </div>
        </AutoSkeleton>
      )}

      {periodValue === "week" && (
        <div
          className={`flex align-center flex-wrap gap-10px ${fluidCSS()
            .ltX(700, { width: "100%" })
            .end()}`}
        >
          <AutoSkeleton h="10vh" w="150px" loading={loading}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="month-select-label">Mes</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={selectedMonth}
                onChange={(e) => handleMonthChange(+e.target.value)}
                label="Mes"
                MenuProps={{
                  disableScrollLock: true, // Evita que se bloquee el scroll
                }}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const date = dayjs().subtract(i, "month");
                  return (
                    <MenuItem key={date.format("YYYY-MM")} value={date.month()}>
                      {format(new Date(date), "MMMM yyyy", {
                        locale: esLocale,
                      })}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </AutoSkeleton>
          <AutoSkeleton h="10vh" w="150px" loading={loading}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="week-select-label">Semana</InputLabel>
              <Select
                labelId="week-select-label"
                id="week-select"
                value={selectedWeek}
                onChange={(e) => handleWeekChange(+e.target.value)}
                label="Semana"
                MenuProps={{
                  disableScrollLock: true, // Evita que se bloquee el scroll
                }}
              >
                {Array.from({ length: 4 }, (_, i) => {
                  const { start, end } = getWeekRange(selectedMonth, i + 1);
                  const date = dayjs().month(selectedMonth).date(start);

                  // Solo mostrar intervalos que no estén en el futuro
                  if (date.isAfter(dayjs())) {
                    return null;
                  }

                  return (
                    <MenuItem key={i + 1} value={i + 1}>
                      {start === end
                        ? `del ${start}`
                        : `del ${start} al ${end}`}
                    </MenuItem>
                  );
                }).filter(Boolean)}
              </Select>
            </FormControl>
          </AutoSkeleton>
        </div>
      )}

      {periodValue === "month" && (
        <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
          <AutoSkeleton h="10vh" w="250px" loading={loading}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="month-select-label">Mes</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={selectedMonth}
                onChange={(e) => handleMonthChange(+e.target.value)}
                label="Mes"
                MenuProps={{
                  disableScrollLock: true, // Evita que se bloquee el scroll
                }}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const date = dayjs().subtract(i, "month");
                  return (
                    <MenuItem key={date.format("YYYY-MM")} value={date.month()}>
                      {format(new Date(date), "MMMM yyyy", {
                        locale: esLocale,
                      })}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </AutoSkeleton>
        </div>
      )}
    </div>
  );
}

function getInitWeek(selectedMonth) {
  const mes = dayjs().month();
  let setdayjs = dayjs([null, START_DATE][+!!START_DATE]);
  if (selectedMonth == mes) {
    if (setdayjs.month() != mes) {
      setdayjs = dayjs();
    }
    return calcsetdayjs();
  }
  if (START_DATE) {
    return calcsetdayjs();
  }
  return 1;
  function calcsetdayjs() {
    return Math.ceil(setdayjs.date() / 7);
  }
}
