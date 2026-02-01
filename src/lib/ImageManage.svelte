<script lang="ts">
     async function deleteImage(file: string) {
        const response = await fetch(`/api/remove`, {
            method: 'DELETE',
            body: JSON.stringify({ file })
        });
        const removed: { ok: boolean } = await response.json();
        if (removed.ok) {
            data.fileList = data.fileList.filter((f: string) => f !== file);
        }
    }
</script>

<div class="item">
    <h2>{file}</h2>
    <img src="/api/images/{file}" height="100" alt="">
    <button onclick={() => deleteImage(file)}>Delete</button>
</div> 