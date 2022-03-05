<script lang="ts">
	import InfoIcon from '../../icons/InfoIcon.svelte';
</script>

<div class="notice info-notice">
	<span class="icon">
		<InfoIcon fill="rgb(49, 130, 206)" width="16px" height="16px" />
	</span>
	<span class="text">
		<slot />
	</span>
</div>

<style lang="scss">
	.notice {
		display: flex;
		align-items: center;
		background: #bee3f8;
		color: rgb(24 28 36);
		padding: 12px;
		font-size: 13px;

		.icon {
			margin-right: 12px;
		}
	}
</style>
