<script>
export default {
    data() {
        return {
            SupportContact: [
                {
                    title: "disanto.vincenzo98@gmail.com"
                    
                },
                {
                    title: "diego.giordano@gmail.com"
                },
                {
                    title: "nicola.ceccagnoli@gmail.com"
                },
                {
                    title: "riccardo.minei@gmail.com"
                },
                
            ],
            

        };
    },
    methods: {

    }
}
</script>

<template>
    
    <footer  class="container-fluid">
       <hr> 
        <div class="container-md">
            <div class="row">
                

                <div class="col-sm-12 col-md-4 col-lg-2 mb-4  space">
                    <div class="text-left">
                        <h3>SupportContact</h3>
                        <ul>
                            <li v-for="(pippo,i) in SupportContact" :key="i" >{{pippo.title}}</li>
                           
                        </ul>
                    </div>
                </div>

              

                <div class="col-sm-12 col-md-4 col-lg-2 mb-3  space">
                    <h3>NEWSLETTER</h3>
                    <div>
                        <input id="emailInput" type="email" class="form-control" placeholder="Email" >  
                    </div>
                    <div>
                        <textarea   placeholder="Message"></textarea>  
                    </div>
                    <button class="form-control">SEND MESSAGE</button>
                </div>
            </div>
        </div>

        
       
    </footer>
</template>

<style lang="scss" scoped>
    @use'../assets/SCSS/main.scss';
    @use '../assets/SCSS/footer.scss';



</style>
