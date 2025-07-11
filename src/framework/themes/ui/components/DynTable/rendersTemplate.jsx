import React from "react";
import { Typography } from "@mui/material";
import { getNumberFormat } from "./modelsFormat.jsx";
import { ReserveLayer } from "../containers.jsx";
import { TooltipGhost } from "../controls.jsx";

export function rendersTemplate(columns_config) {
  columns_config.map((column) => {
    const { renderInfo } = column;
    if (renderInfo) {
      let {
        "date-format": date_format,
        "number-format": number_format,
        label,
        iconized,
        local,
        sufix,
        hide_seconds,
        join_date,
      } = renderInfo;

      if (label) {
        return Object.assign(column, LabelFormat());
      }
      if (number_format) {
        Object.assign(column, NumberFormat());
      }
      if (date_format) {
        Object.assign(column, DateFormat());
      }

      if (iconized) {
        const { renderCell } = LabelFormat();
        return Object.assign(column, { renderCell });
      }

      function DateFormat() {
        return {
          renderString(params) {
            const { value } = params;
            let texto = "---";
            let tooltip = "Fecha no disponible";

            if (value) {
              ({ texto } = extractInfoDate());
              tooltip = texto;
            }

            return { texto, tooltip };

            function extractInfoDate() {
              const date = new Date(value);
              const formattedDate = date.toLocaleString(
                global.nullishNoF(local, "es-ES"),
                date_format
              );
              const [datePart, timePart] = formattedDate.split(", ");
              let [hour, minute, seconds] = timePart.split(":");
              if (hide_seconds) {
                seconds = null;
              } else {
                seconds = seconds.split(" ")[0];
              }
              const time = [hour, minute, seconds].filter(Boolean).join(":");
              const sufix_time = date_format["hour12"]
                ? ["AM", "PM"][+(date.getHours() >= 12)]
                : "";
              const formattedTime = [time, sufix_time]
                .filter(Boolean)
                .join(" ");
              let texto = [datePart, formattedTime].join(", ");
              if (join_date) {
                texto = texto.split(" de ").join(join_date);
              }
              return {
                texto,
                formattedTime,
                sufix_time,
                datePart,
                timePart,
                hour,
                minute,
                seconds,
                time,
              };
            }
          },
          renderCell: RenderGeneral({ column, ...column }),
        };
      }

      function NumberFormat() {
        return {
          renderString(params) {
            const { value, row } = params;
            let retorno;

            let texto = "---";
            let tooltip = "Valor no disponible";

            if (value == null) {
              return { texto, tooltip };
            }

            const number_format_ =
              typeof number_format == "function"
                ? number_format(params)
                : number_format;

            ({ retorno } = getNumberFormat().numberFormat(
              number_format_,
              value,
              local,
              retorno
            ));

            ({ retorno: texto } = processSufix(row, sufix, retorno));

            tooltip = texto;

            return { texto, tooltip };
          },
          renderCell: RenderGeneral({ column, ...column }),
        };
      }

      function LabelFormat() {
        return {
          renderString(params) {
            const { value } = params;
            const {
              text = (value ?? "").toString(),
              color,
              icon,
            } = label[value] || {};
            return { texto: text, tooltip: text, color, icon };
          },
          renderCell(params) {
            let renderString;
            if (column.renderString) {
              renderString = column.renderString(params);
            } else {
              ({ value: renderString } = params);
            }
            const { texto, tooltip, color, icon } = (() => {
              if (iconized) {
                return iconized(params, renderString.texto);
              }
              return renderString;
            })();
            return RenderGeneral({
              column,
              ...column,
              className:
                "LabelFormat d-center gap-10px " + (column.className || ""),
              component: column.component || "Typography",
              tooltip,
              color,
              children: (
                <>
                  {icon} {texto}
                </>
              ),
            });
          },
        };
      }
    }
  });

  function RenderGeneral({
    column,
    style = {},
    className = "",
    children,
    //General
    component = "div",
    tooltip,
    //MUI
    color,
  }) {
    const ComponentSelected = ({ children, fromChildren, tooltip }) => {
      const CLASSNAME = `RenderGeneral-${component} ${
        fromChildren ? "fromChildren" : ""
      } ${tooltip ? "tooltip" : "noTooltip"} ${className}`;
      switch (component) {
        case "ReserveLayer":
          return (
            <ReserveLayer style={style} className={CLASSNAME}>
              {children}
            </ReserveLayer>
          );
        case "Typography":
          return (
            <Typography style={style} className={CLASSNAME} color={color}>
              {children}
            </Typography>
          );
        case "div":
        default:
          return (
            <div style={style} className={CLASSNAME}>
              {children}
            </div>
          );
      }
    };

    const EnvolveTooltip = ({ children, tooltip = "", fromChildren }) => {
      const CompEnv = (
        <ComponentSelected fromChildren={fromChildren} tooltip={tooltip}>
          {children}
        </ComponentSelected>
      );
      return (
        <TooltipGhost title={tooltip}>
          <div>{CompEnv}</div>
        </TooltipGhost>
      );
    };
    if (children) {
      return (
        <EnvolveTooltip tooltip={tooltip} fromChildren>
          {children}
        </EnvolveTooltip>
      );
    }
    return (params) => {
      const { texto, tooltip } = column["renderString"](params);
      return <EnvolveTooltip tooltip={tooltip}>{texto}</EnvolveTooltip>;
    };
  }

  function processSufix(row, sufix, retorno) {
    if (sufix) {
      const row_sufix = row[sufix];
      if (row_sufix) {
        sufix = row_sufix;
      }
      retorno = [retorno, sufix].filter(Boolean).join(" ");
    }
    return { sufix, retorno };
  }
}
