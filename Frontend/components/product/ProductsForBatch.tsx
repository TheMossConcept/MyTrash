import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import useProducts from "../../hooks/useProducts";
import CreateProduct from "./CreateProduct";
import ProductsDetails from "./ProductsDetails";

// TODO: I think we can do this more elegantly
type Props = {
  batchId: string;
  clusterId: string;
  productionPartnerId: string;
};

const ProductsForBatch: FC<Props> = ({
  batchId,
  clusterId,
  productionPartnerId,
}) => {
  const { products, refetchProducts } = useProducts({ batchId });

  return (
    <View>
      <View style={styles.createProductView}>
        <CreateProduct
          batchId={batchId}
          productionPartnerId={productionPartnerId}
          clusterId={clusterId}
          successCallback={refetchProducts}
        />
      </View>
      <ProductsDetails products={products} refetchProducts={refetchProducts} />
    </View>
  );
};

const styles = StyleSheet.create({
  createProductView: {
    marginBottom: 15,
  },
});

export default ProductsForBatch;
