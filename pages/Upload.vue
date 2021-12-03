<template>
	<div id="sketchfab-asset">
		<form class="form">
			<SfInput 
        v-model='productName'
				label="Product Name"
				name="productName"
				class="form__element"
				required
				error-message=""
			/>
			<SfTextarea
        v-model='productDescription'
				label="Description"
				name="description"
        class="form__element"
        cols="60"
        rows="10"
				wrap="soft"
        maxlength="500"
				placeholder="Enter a description for your product."
				required
			/>
      <SfSelect
        v-model='productCategory'
				label="Product Category"
				name="productCat"
        class="form__element"
        cols="60"
        rows="10"
				wrap="soft"
        maxlength="500"
				placeholder="Select a category for your product."
				required
			>
        <SfSelectOption value="Weapons">Weapons</SfSelectOption>
        <SfSelectOption value="Armor">Armor</SfSelectOption>
        <SfSelectOption value="Magic">Magic</SfSelectOption>
        <SfSelectOption value="Creatures">Creatures</SfSelectOption>
        <SfSelectOption value="Environment">Environment</SfSelectOption>
      </SfSelect>
			
			<div id="sketchfabid">
				<SfInput
          v-model='sketchfabuid'
					label="Model UID"
					name="sketchfabuid"
					class="form__element"
					required
					error-message=""
				/>
			</div>
      <div class="dropbox">
          <input 
            type="file" 
            ref="file"
            name="productImage" 
            class="form__element input-file"
            @change="fileChanged"
            accept="image/*" 
            >
        </div>
      <div class="form__action">
        <SfButton type="submit" @click.prevent="submit">Submit</SfButton>
        
      </div>
		</form>
	</div>
</template>
<script>
import {
SfInput,
SfComponentSelect,
SfTextarea,
SfCheckbox,
SfButton,
SfSelect
} from '@storefront-ui/vue';

export default {
	name: 'Upload',
	components: {
		SfInput,
		SfComponentSelect,
		SfTextarea,
		SfCheckbox,
    SfButton,
    SfSelect
	},
  props: {
    /*prodName: String,
    prodDescrip: String,
    cat: String,
    uid: String*/
  },
  data() {
    return {
      productName: '',
      productDescription: '',
      productCategory: '',
      sketchfabuid: '',
      image: '',
      file:''
    }
  },
	methods: {
    fileChanged() {
      const file = this.$refs.file.files[0];
      this.file = file;
      const base64 = this.encodeImage(this.file);
      base64.then((result) => {
        //remove the base64 header
        this.image = result.split(',')[1];
      });
      /**var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.encodeImage(files[0]);*/
    },
    encodeImage(file) {
      return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function() { resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    submit() {
      this.createProduct();
    },
    async createProduct() {
      try {
        const response = await this.$axios({
          method: 'post',
          url: '/shopifyAdmin',
          headers: {
          'Content-Type': 'application/json'
          },
          data: {
              "productName": this.productName,
              "productDescription": this.productDescription,
              "productCategory": this.productCategory,
              "sketchfabuid": this.sketchfabuid,
              "productImage": this.image
          }
        })
        console.log(response);
        window.location.replace('/');
      }
      catch (error) {
        console.log(error);
      }
    }
  },
}
/*
<SfCheckbox
        v-model='sketchAsset'
				name="3dcheck"
				label="Is this a Sketchfab 3D asset?"
        class="form__element"
        valid
        :disabled="false"
        :selected="true"
			/>
*/
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
#form-template {
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    padding: 0 var(--spacer-sm);
    max-width: 870px;
    margin: 0 auto;
  }
}
.form {
  padding: var(--spacer-sm) 0;
  &__group {
    display: flex;
    align-items: flex-start;
  }
  &__action-button {
    &:first-child {
      margin: var(--spacer-sm) 0 0 0;
    }
    &--secondary {
      margin: var(--spacer-sm) 0 var(--spacer-sm) var(--spacer-base);
    }
  }
  &__button {
    --button-width: 100%;
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    flex-direction: column;
    margin: 0 var(--spacer-2xl) 0 0;
    &:last-of-type {
      margin: 0 calc(var(--spacer-2xl) - var(--spacer-sm)) 0 0;
    }
    &__element {
      margin: 0 0 var(--spacer-sm) 0;
      flex: 0 0 100%;
      &--half {
        flex: 1 1 50%;
        &-even {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
      &--range {
        margin: var(--spacer-xl) var(--spacer-base) var(--spacer-2xl);
      }
    }
    &__action {
      flex: 0 0 100%;
      display: flex;
    }
    &__button {
      --button-width: auto;
    }
  }
}
</style>
