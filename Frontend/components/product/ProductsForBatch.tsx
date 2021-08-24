import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import useQueriedData from "../../hooks/useQueriedData";
import { Product } from "../../typings/types";
import LoadingIndicator from "../styled/LoadingIndicator";
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
  const {
    data: products,
    refetch: refetchProducts,
    isLoading,
  } = useQueriedData<Product[]>("/GetProducts", { batchId });

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
      {isLoading && <LoadingIndicator />}
      <ProductsDetails
        products={products || []}
        refetchProducts={refetchProducts}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  createProductView: {
    marginBottom: 15,
  },
});

export default ProductsForBatch;
