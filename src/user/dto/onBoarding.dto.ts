import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt } from 'class-validator';


export class OnBoarding {

    @IsArray()
    @IsInt({each:true}) // Chaque élément doit être un entier
    @Type(() => Number) // Transforme les valeurs en nombres si elles arrivent en string
    @ArrayMinSize(2) // Minimum deux éléments dans le tableau
    skillIds!: number[];
}