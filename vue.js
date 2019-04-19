var shared = {
};

var zoom = 50;

var vm1 = new Vue({
  el: "#vm1",
  data() {
    return {
      title: "WebACS",
      zoom,
      shared
    }
  },
  watch: {
    zoom: function(val) {
      
      let newWidth = 3000 * val / 100;
      let newHeight = 2000 * val /100;

      let parent = $("#modelPanelcanvasPanel0 > div");
      let elems = $("#modelPanelcanvasPanel0 > div > canvas");
      
      parent.css({
        width: newWidth,
        height: newHeight
      });
      
      elems.attr({
        width: newWidth,
        height: newHeight
      });

      elems.css({
        width: newWidth,
        height: newHeight
      });

    }
  },
  mounted() {
    console.log("mounted");
    console.log($("#modelPanelcanvasPanel0 > div > canvas"));
  }
})

var vm2 = new Vue({
  el: "#vm2",
  data() {
    return {
      zoom,
      shared
    }
  },
  created() {
    console.log("created vm2");
    console.log(this.zoom);
  }
})