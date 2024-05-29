import {FrappeObject} from './Types';


interface SectionAnalysis {
    sectionBreakCount: number;
    columnsPerSection: number[];
}
function analyzeFrappeObject(frappeObject: FrappeObject): SectionAnalysis {
    let sectionBreakCount = 0;
    let columnsPerSection: number[] = [];
    let currentColumnCount = 0;

    for (const doc of frappeObject.docs) {
        for (const field of doc.fields) {
            if (field.fieldtype.toLowerCase().includes('section')) {
                if (sectionBreakCount > 0) {  // Avoid pushing for the first section found
                    columnsPerSection.push(currentColumnCount);
                }
                sectionBreakCount++;
                currentColumnCount = 0; // Reset column count for the new section
            } else if (field.fieldtype.toLowerCase().includes('column') && sectionBreakCount > 0) {  // Only count if inside a section
                currentColumnCount++;
            }
        }
    }

    // Push the last section's column count if at least one section was encountered
    if (sectionBreakCount > 0) {
        columnsPerSection.push(currentColumnCount);
    }

    return {
        sectionBreakCount,
        columnsPerSection
    };
}

// @ts-ignore
const analysis = analyzeFrappeObject(frappe2);

console.log({analysis})
