<script>
	export let defaultValue = null;

	$: flagValue = defaultValue;

	const setFlag = (value) => (flagValue = value);
</script>

<slot flag={flagValue} {setFlag} />
