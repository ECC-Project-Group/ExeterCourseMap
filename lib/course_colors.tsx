// Get the color of a course depending on its subject
export function getCourseColor(courseNo: string) {
    const subject = courseNo.substring(0, 3);
    switch(subject) {
        // Arts - purple to pink
        case 'MUS': return 'rgb(128, 0, 255)';
        case 'ART': return 'rgb(179, 0, 255)';
        case 'DAN': return 'rgb(238, 0, 255)';
        case 'THR': return 'rgb(255, 0, 174)';

        // Humanities - red to yellow
        case 'ENG': return 'rgb(154, 29, 46)'; // Exeter red
        case 'HIS': return 'rgb(250, 100, 20)';
        case 'REL': return 'rgb(255, 160, 0)';
        case 'ANT': return 'rgb(255, 210, 0)';

        // Classical languages - idk
        case 'LAT': return 'rgb(73, 15, 112)'; // ancient romans liked purple
        case 'GRK': return 'rgb(128, 128, 0)'; // olives

        // STEM - green to blue
        case 'BIO': return 'rgb(20, 185, 0)';
        case 'EPS': return 'rgb(20, 185, 0)';
        case 'CHE': return 'rgb(0, 255, 140)';
        case 'PHY': return 'rgb(4, 230, 255)';
        case 'MAT': return 'rgb(5, 150, 255)';
        case 'CSC': return 'rgb(0, 40, 255)';

        // Misc.
        case 'ECO': return 'rgb(255, 255, 255)';
        case 'HHD': return 'rgb(255, 255, 255)';
        case 'PEC': return 'rgb(255, 255, 255)';
        case 'INT': return 'rgb(255, 255, 255)';
        case 'EXI': return 'rgb(255, 255, 255)';
        case 'PSY': return 'rgb(255, 255, 255)';

        default: return 'rgba(0, 0, 0, 0)';
    }
}

// Get the flag image correpsonding to a modern language
export function getCourseImage(courseNo: string) {
    // Modern languages - we'll return a flag instead
    switch (courseNo.substring(0, 3)) {
        case 'ARA': return 'url(/images/algeria.png)';
        case 'CHI': return 'url(/images/china.png)';
        case 'FRE': return 'url(/images/france.png)';
        case 'GER': return 'url(/images/germany.png)';
        case 'ITA': return 'url(/images/italy.png)';
        case 'JPN': return 'url(/images/japan.png)';
        case 'RUS': return 'url(/images/russia.png)';
        case 'SPA': return 'url(/images/spain.png)';
        default: return '';
    } 
}