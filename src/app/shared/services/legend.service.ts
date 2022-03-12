import {Injectable} from '@angular/core';
import {LegendSource} from "../../model/legend-source";
import {LegendIconSource} from "../../model/legend-icon-source";
import {LegendPoint} from "../../model/legend-point";

@Injectable({providedIn: 'root'})
export class LegendService {
    static FREQUENT = "sfrequent"
    static ICON_COLORS = ["orange", "blue", "red", "vanilla"];
    static ICON_IMAGES = ["saltandpepper", "skimmer", "spatula2", "grill", "bowl", "cutting board", "fork", "grater", "grill", "ketchup bottle", "knife", "ladle", "measuring cup", "pot", "rollingpin"];
    static instance: LegendService;
    legendLookup = new Map();
    placeholderSource: LegendIconSource

    constructor() {
        // If the static reference doesn't exist
        // (i.e. the class has never been instantiated before)
        // set it to the newly instantiated object of this class
        if (!LegendService.instance) {
            LegendService.instance = this;
            this.placeholderSource =  new LegendIconSource();
            this.placeholderSource.color = "orange";
            this.placeholderSource.icon = "placeholder";
        }

        // Return the static instance of the class
        // Which will only ever be the first instance
        // Due to the if statement above
        return LegendService.instance;
    }

    processLegend(sources: Array<LegendSource>): Map<string, LegendPoint> {
        if (!sources) {
            return new Map();
        }
        var existingSources: Array<LegendIconSource> = [];
        var existingLegends:LegendPoint[] = [];
        var apiToAdd: Array<LegendSource> = [];
        // loop through new sources
        //   - pulling existing legends (and their icon sources, separately saved)
        //   - pulling out new sources to be saved
        for ( var i = 0; i < sources.length ; i++) {
            var newLegend = sources[i];
            var matchFound = false;

            this.legendLookup.forEach((existing: LegendPoint, key: string) => {
                if (!matchFound && existing.key == newLegend.key) {
                    matchFound = true;
                    let legendSource = new LegendIconSource();
                    legendSource.color = existing.color;
                    legendSource.icon = existing.icon;
                    existingSources.push(legendSource);
                    existingLegends.push(existing);
                }

            });
            if (!matchFound) {
                apiToAdd.push(newLegend);
            }
        }

        // retrieve new icon sources for new sources (using existing, to not repeat icons)
        let newSources = this.retrieveNewListSources(existingSources, apiToAdd.length);

        // assemble new ShoppingListLegend - collect LegendPoints
        var unsortedLegendPoints: LegendPoint[] = existingLegends;

        // add new legend points
        for (let source of apiToAdd) {
            var toAdd = new LegendPoint();
            toAdd.key = source.key;
            toAdd.display = source.display;
            unsortedLegendPoints.push(toAdd);
        }

        // sort by name
        unsortedLegendPoints.sort((a, b) => {
            return a.display.toLowerCase().localeCompare(b.display.toLowerCase());
        });

        // fill in LegendPointSource when empty
        var sourcePointIndex = 0;
        var resultPoints: LegendPoint[] = [];

        for (var i = 0;  i<unsortedLegendPoints.length; i++) {
            var point = unsortedLegendPoints[i];
            if (!point.icon) {
                var legendSource = newSources[sourcePointIndex];
                point.icon = legendSource.icon;
                point.color = legendSource.color;
                sourcePointIndex = sourcePointIndex + 1;
            }
            resultPoints.push(point)
        }

        // set sorted legend points in dictionary
        this.legendLookup = new Map();
        for (var i = 0 ; i< resultPoints.length; i++) {
            let legendPoint = resultPoints[i];
            this.legendLookup.set(legendPoint.key, legendPoint);
        }

        // return legend points
        return this.legendLookup;
    }


    private retrieveNewListSources(existingSources: Array<LegendIconSource>, count: number) : Array<LegendIconSource> {
        var pool: LegendIconSource[] = [];
        var startIndex = 0;
        for (let i = 0;  i < LegendService.ICON_COLORS.length;i++) {
            var colorIndex = i;
            for (let iconIndex = 0;  iconIndex< LegendService.ICON_IMAGES.length;iconIndex++) {
                var icon = LegendService.ICON_IMAGES[iconIndex];
                var color = LegendService.ICON_COLORS[colorIndex];
                if (colorIndex >= LegendService.ICON_COLORS.length - 1) {
                    colorIndex = 0;
                } else {
                    colorIndex = colorIndex + 1;
                }

                // check if this combo exists
                let found = existingSources.filter( (existing: LegendIconSource) =>
                    (icon == existing.icon) &&
                    (color == existing.color)
                );

                if (found && found.length > 0) {
                    // mark start index
                    startIndex = pool.length;
                } else {
                    // add to collection
                    var source = new LegendIconSource();
                    source.color = color;
                    source.icon = icon;
                    pool.push(source);
                }
            }

        }
        while  (pool.length <= count) {
            pool.push(this.placeholderSource)
        }
        // now gather required number of point sources from the pool
        var results: LegendIconSource[] = [];
        var resultsTarget = Math.min(count, pool.length);

        var poolIndex = startIndex;
        while (results.length < resultsTarget) {
            let nextSource = pool[poolIndex];
            results.push(nextSource);
            if (poolIndex == pool.length - 1) {
                poolIndex = 0;
            } else {
                poolIndex = poolIndex + 1;
            }


        }
        return results;

    }
}
