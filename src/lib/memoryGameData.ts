import * as materialIcons from 'react-icons/md';

// 3650 possible icons
// Creates an array of icons in random order
export function getUniqueIcons(count: number): any {

    console.log(`Getting ${count} icons...`);

    let iconArray: Array<any> = Object.values(materialIcons);
    const shuffledUniqueIcons = iconArray.sort(() => Math.random() - 0.5).slice(0, count);

    // Return a list of n icons, with each icon having a single 
    // pair for a total list size of n * 2
    const iconPairsArray: Array<any> = [...shuffledUniqueIcons, ...shuffledUniqueIcons].sort(() => Math.random() - 0.5);

    console.log(`Pairs array: `, iconPairsArray);

    return iconPairsArray;
}