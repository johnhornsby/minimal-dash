/**
 * Takes an array of numbers and pucks out any odd spike values that don't
 * represent the typical varience within the typical range of values
 */
export function removeSpikes(values) {
	const sortedValues = values.sort((a, b) => a > b);
	const median = getMedian(sortedValues);

	// establish variance from median
	let variances = [];

	for (let i = 0; i < sortedValues.length; i++) {
		variances.push({
			index: i,
			value: Math.abs(median - sortedValues[i])
		});
	}

	// order the variances
	variances = variances.sort((a, b) => a.value > b.value);

	// calculate area of variance, imagine a graph where vairance is ploted against the number of variants
	// a large area signifies a wide range of variance across values, a small variance signifies a general
	// small variance across typical values.
	let area = 0;
	variances.reduce(function(previous, next) {
		area += previous.value + ((next.value - previous.value) / 2);
		return next;
	});

	// calculate amount of variance
	const maxValue = variances[variances.length - 1].value;
	const totalArea = variances.length * maxValue;
	const maxAmountOfVarianceAllowed = (area / totalArea) * maxValue;

	// use only values that are within the max variance
	let clippedValues = [];
	for (let variance of variances) {
		if (variance.value <= maxAmountOfVarianceAllowed) {
			clippedValues.push(sortedValues[variance.index]);
		}
	}

	// console.log(median, sortedValues, clippedValues, maxAmountOfVarianceAllowed)

	// if all values are clipped then return the median
	if (clippedValues.length === 0) {
		return [median];
	}

	clippedValues = clippedValues.sort((a, b) => a > b);

	return clippedValues;
}

export function getMedian(sortedValues) {
	let startIndex = Math.floor(sortedValues.length / 2) - 1;
	let endIndex = Math.ceil(sortedValues.length / 2) - 1;

	if (startIndex === endIndex) {
		return sortedValues[startIndex];
	}
	
	return sortedValues[startIndex] + ((sortedValues[endIndex] - sortedValues[startIndex]) / 2);
}