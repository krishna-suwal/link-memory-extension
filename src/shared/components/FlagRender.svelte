<script lang="ts">
	export let defaultValue: any = null;

	$: flagValue = defaultValue;

	const setFlag = (value: any) => (flagValue = value);
</script>

<slot flag={flagValue} {setFlag} />
