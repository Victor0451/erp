import * as XLSX from 'xlsx';
import moment from 'moment';

interface ExportColumn {
    header: string;
    accessor: string;
    formatter?: (value: any) => any;
}

interface ExportOptions {
    filename: string;
    columns: ExportColumn[];
    data: any[];
}

/**
 * Exporta datos a un archivo Excel
 * @param options - Opciones de exportación incluyendo nombre de archivo, columnas y datos
 */
export function exportToExcel({ filename, columns, data }: ExportOptions) {
    // Preparar los datos para exportación
    const exportData = data.map(row => {
        const exportRow: any = {};
        columns.forEach(col => {
            let value = row[col.accessor];

            // Aplicar formateador personalizado si existe
            if (col.formatter) {
                value = col.formatter(value);
            } else {
                // Formateo por defecto para fechas
                if (value instanceof Date) {
                    value = moment(value).format('DD/MM/YYYY');
                } else if (typeof value === 'number') {
                    // Mantener números como números para Excel
                    value = value;
                } else if (value === null || value === undefined) {
                    value = '';
                }
            }

            exportRow[col.header] = value;
        });
        return exportRow;
    });

    // Crear libro de trabajo
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    // Ajustar ancho de columnas automáticamente
    const columnWidths = columns.map(col => ({
        wch: Math.max(col.header.length, 15)
    }));
    worksheet['!cols'] = columnWidths;

    // Generar archivo y descargar
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Crear enlace de descarga
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${moment().format('YYYY-MM-DD_HH-mm')}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
