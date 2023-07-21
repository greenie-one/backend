BASE_DIR=$(realpath "$(dirname "$0")/../")


copy_dtos() {
  mkdir -p "${BASE_DIR}/temp"
  cp -r "${BASE_DIR}/src/dtos" "${BASE_DIR}/temp"
}

strip_decorators() {
  find "${BASE_DIR}/temp/" -type f -exec sed -i -E "s/^\s*@(.*)//" {} \;
  find "${BASE_DIR}/temp/" -type f -exec sed -i -E "s/^import(.*)$//" {} \;
  find "${BASE_DIR}/temp/" -type f -exec sed -i '/^$/d' {} \;
  find "${BASE_DIR}/temp/" -type f -exec sed -i -E 's/}/}\n/' {} \;

}

copy_dtos
strip_decorators