import {storyblokEditable} from '@storyblok/react/rsc'
import type {SbBlokData} from '@storyblok/js'

type DataTableRowBlok = SbBlokData & {
  cells?: string
}

type DataTableBlokData = SbBlokData & {
  caption?: string
  has_header_row?: boolean
  rows?: DataTableRowBlok[]
}

function parseCells(row: DataTableRowBlok): string[] {
  if (!row.cells) return []
  return row.cells.split('|').map((cell) => cell.trim())
}

export default function DataTableBlok({blok}: {blok: DataTableBlokData}) {
  const rows = blok.rows ?? []
  if (rows.length === 0) return null

  return (
    <div className="my-8" {...storyblokEditable(blok)}>
      {blok.caption && (
        <p className="mb-2 text-sm font-medium text-slate-700" {...storyblokEditable(blok)}>
          {blok.caption}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-slate-200 text-sm">
          <tbody>
            {rows.map((row, rowIndex) => {
              const cells = parseCells(row)
              return (
                <tr key={row._uid} className="border-b border-slate-200">
                  {cells.map((cell, cellIndex) => {
                    const Tag = blok.has_header_row && rowIndex === 0 ? 'th' : 'td'
                    return (
                      <Tag
                        key={`${row._uid}-${cellIndex}`}
                        className="border border-slate-200 px-3 py-2 text-left"
                      >
                        {cell}
                      </Tag>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
