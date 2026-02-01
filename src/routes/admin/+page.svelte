 <script lang="ts">
    export let data;

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

<div class="container">
    <h1>ADMIN PAGE</h1>
    <button>Export all images</button>
    
    
    <div class="list">
        
        {#each data.fileList as file}
            <div class="item">
                <img src="/src/lib/assets/imgs/{file}" height="100" alt="">
                <button onclick={() => deleteImage(file)}>Delete</button>
            </div> 
        {/each}
    </div>
</div>

<style scoped>
    .list {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 20px;
        width: 100%;
    }
    .item {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .item img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    button {
        background-color: white;
        color: var(--primary-color);
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
    }
</style>