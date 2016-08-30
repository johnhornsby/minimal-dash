/**
 * Takes an array of numbers and pucks out any odd spike values that don't
 * represent the typical varience within the typical range of values
 */
export function removeSpikes(values, tolerance = 0) {

	// nothing to clip
	if (values.length < 2) {
		return values;
	}

	// Utility function to return the sum variance against a defined value within an array of values
	function getSumVariancesOfIndex(values, index) {
		let varianceSum = 0;

		for (let i = 0; i < values.length; i++) {
			if (i !== index) {
				varianceSum += Math.abs(values[index] - values[i]);
			}
		}

		return varianceSum;
	}

	// Utility function to return the value that varies the least relative to the other values
	function getValueOfLeastVariance(values) {
		let minSum = Number.POSITIVE_INFINITY;
		let currentSum;
		let minIndex = -1;

		for (let i = 0; i < values.length; i++) {
			currentSum = getSumVariancesOfIndex(values, i);
			if (currentSum < minSum) {
				minSum = currentSum;
				minIndex = i;
			}
		}

		return values[minIndex];
	}

	// Utility function to return the area of the variance against a possible max
	function getAreaPercentage(values) {

		let area = 0;
		const max = values.reduce((previous, next) => Math.max(previous, next));
		const min = values.reduce((previous, next) => { return Math.min(previous, next)}, max);
		
		const difference = max - min;
		let maxArea = difference * (values.length - 1);

		for (let i = 0; i < values.length; i++) {
			area += values[i] - min;
		}

		return area / maxArea;
	}

	// first off remove nulls 
	values = values.filter(value => value !== null && value !== undefined && value !== Number.POSITIVE_INFINITY && isNaN(value) === false);

	// initial sort to begin to analyse the variance between the values
	const sortedValues = values.sort((a, b) => a - b);
	// we attempt to find a value that is more similar to all the others, we used to use the median here
	const median = getValueOfLeastVariance(values);

	// now log all variances from median
	let variances = [];

	for (let i = 0; i < sortedValues.length; i++) {
		variances.push({
			index: i,
			value: Math.abs(median - sortedValues[i])
		});
	}

	// order the variances
	variances = variances.sort((a, b) => a.value - b.value);

	// calculate area of variance, imagine a graph where vairance is ploted against the number of variants
	// a 100% proportional line from bottom left to top right would signify a 100% distributed set of variences,
	// ergo 50% area would signify no spikes and all values equally distrubuted.
	// a large area signifies a wide range of variance across values, a small variance signifies a general
	// small variance across typical values.
	let area = 0;

	// calculate max amount of variance
	const maxValue = variances[variances.length - 1].value;
	const clipPercentage = getAreaPercentage(variances.map(variance => variance.value));
	const toleranceAdjustment = (1 - clipPercentage) * tolerance;
	const clipPercentageToleranceAdjusted = clipPercentage + toleranceAdjustment;
	let maxAmountOfVarianceAllowed = maxValue * clipPercentageToleranceAdjusted;

	// use only values that are within the max variance
	let clippedValues = [];
	for (let variance of variances) {
		if (variance.value <= maxAmountOfVarianceAllowed) {
			clippedValues.push(sortedValues[variance.index]);
		}
	}

	// if all values are clipped then return the median
	if (clippedValues.length === 0) {
		return [median];
	}

	clippedValues = clippedValues.sort((a, b) => a - b);

	return clippedValues;
}




export function getMedian(sortedValues) {
	let startIndex = Math.floor(sortedValues.length / 2) - 1;
	let endIndex = Math.ceil(sortedValues.length / 2) - 1;

	if (sortedValues.length === 0) {
		return null;
	}

	if (sortedValues.length === 1) {
		return sortedValues[0];
	}

	if (startIndex === endIndex) {
		return sortedValues[startIndex];
	}
	
	return sortedValues[startIndex] + ((sortedValues[endIndex] - sortedValues[startIndex]) / 2);
}
